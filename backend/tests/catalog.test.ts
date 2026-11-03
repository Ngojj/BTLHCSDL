import { describe, expect, it } from "vitest";
import { pool } from "../src/db/db";
import { api, bearer, enroll, insertCourse, register, rows, unique } from "./helpers";

describe("course search", () => {
  it("filters, sorts and paginates on the server", async () => {
    const teacher = await register("teacher");
    const tag = unique();
    const ids = [
      await insertCourse(teacher.id, { name: `${tag} Alpha`, price: 100000 }),
      await insertCourse(teacher.id, { name: `${tag} Beta`, price: 300000, language: "English" }),
      await insertCourse(teacher.id, { name: `${tag} Gamma`, price: 200000 }),
      await insertCourse(teacher.id, { name: `${tag} Delta`, price: 0, description: `learn ${tag}-keyword` }),
      await insertCourse(teacher.id, { name: `${tag} Epsilon`, price: 400000 }),
    ];

    const all = await api().get("/course/search").query({ q: tag, limit: 2, page: 3, sort: "price_desc" });
    expect(all.status).toBe(200); // public
    expect(all.body.pagination).toEqual({ page: 3, limit: 2, total: 5, totalPages: 3 });
    expect(all.body.data.map((c: any) => c.courseName)).toEqual([`${tag} Delta`]);

    const firstPage = await api().get("/course/search").query({ q: tag, limit: 2, sort: "price_desc" });
    expect(firstPage.body.data.map((c: any) => c.price)).toEqual([400000, 300000]);

    const priced = await api().get("/course/search").query({ q: tag, minPrice: 150000, maxPrice: 350000, sort: "price_asc" });
    expect(priced.body.data.map((c: any) => c.courseName)).toEqual([`${tag} Gamma`, `${tag} Beta`]);

    const english = await api().get("/course/search").query({ q: tag, language: "English" });
    expect(english.body.data.map((c: any) => c.courseName)).toEqual([`${tag} Beta`]);

    const byDescription = await api().get("/course/search").query({ q: `${tag}-keyword` });
    expect(byDescription.body.pagination.total).toBe(1);

    const student = await register("student");
    await enroll(student.id, ids[2]);
    const popular = await api().get("/course/search").query({ q: tag, sort: "popular", limit: 1 });
    expect(popular.body.data[0]).toMatchObject({ courseName: `${tag} Gamma`, students: 1 });
    expect(popular.body.data[0]).toHaveProperty("teacherFirstName");
  });

  it("treats % and _ in the query literally", async () => {
    const teacher = await register("teacher");
    const tag = unique();
    await insertCourse(teacher.id, { name: `AB${tag}` });
    await insertCourse(teacher.id, { name: `A_${tag}` });
    const res = await api().get("/course/search").query({ q: `A_${tag}` });
    expect(res.body.data.map((c: any) => c.courseName)).toEqual([`A_${tag}`]);
  });

  it("matches the teacher's name", async () => {
    const teacher = await register("teacher");
    const tag = unique();
    await pool.query("UPDATE `user` SET `firstName` = ? WHERE `id` = ?", [`Prof${tag}`, teacher.id]);
    await insertCourse(teacher.id, { name: "Anything" });
    const res = await api().get("/course/search").query({ q: `Prof${tag}` });
    expect(res.body.pagination.total).toBe(1);
  });

  it("rejects invalid parameters", async () => {
    for (const query of [{ limit: 500 }, { page: 0 }, { sort: "random" }, { minPrice: -1 }]) {
      expect((await api().get("/course/search").query(query)).status).toBe(400);
    }
  });

  it("is not vulnerable to SQL injection through q or sort", async () => {
    expect((await api().get("/course/search").query({ q: "' OR 1=1 --" })).body.pagination.total).toBe(0);
    expect((await api().get("/course/search").query({ sort: "price_asc; DROP TABLE course" })).status).toBe(400);
    expect(await rows("SELECT 1 FROM `course` LIMIT 1")).toBeDefined();
  });
});

describe("teacher analytics", () => {
  it("aggregates revenue, growth, rankings and distributions in SQL", async () => {
    const teacher = await register("teacher");
    const cheap = await insertCourse(teacher.id, { name: "Cheap", price: 100000 });
    const pricey = await insertCourse(teacher.id, { name: "Pricey", price: 300000 });
    const students = [await register("student"), await register("student"), await register("student")];

    await enroll(students[0].id, cheap, 0); // this month
    await enroll(students[1].id, pricey, 0); // this month
    await pool.query("INSERT INTO `join` (`courseId`, `studentId`, `dateStart`) VALUES (?, ?, DATE_SUB(CURDATE(), INTERVAL 1 MONTH))", [pricey, students[2].id]);
    await pool.query("UPDATE `join` SET `progress` = 100, `dateComplete` = CURDATE() WHERE `studentId` = ?", [students[0].id]);

    const res = await api().get("/analytics/teacher/overview").query({ months: 3 }).set(bearer(teacher.token));
    expect(res.status).toBe(200);
    expect(res.body.totals).toMatchObject({ courses: 2, enrollments: 3, students: 3, revenue: 700000, completed: 1 });

    const months = res.body.revenueByMonth;
    expect(months).toHaveLength(3); // gap-free series even though two months had no sales
    expect(months[0].revenue).toBe(0);
    expect(months[1]).toMatchObject({ revenue: 300000, enrollments: 1, growthPct: null });
    expect(months[2]).toMatchObject({ revenue: 400000, enrollments: 2, growthPct: 33.3 });
    expect(res.body.bestMonth.revenue).toBe(400000);

    expect(res.body.courses.map((c: any) => [c.name, c.revenueRank, c.revenue])).toEqual([["Pricey", 1, 600000], ["Cheap", 2, 100000]]);
    expect(res.body.progressDistribution.find((b: any) => b.from === 100).count).toBe(1);
    expect(res.body.recentActivity.length).toBeGreaterThan(0);
  });

  it("only counts the caller's own courses and is closed to students and anonymous users", async () => {
    const teacher = await register("teacher");
    const stranger = await register("teacher");
    await enroll((await register("student")).id, await insertCourse(stranger.id, { price: 999000 }));
    const mine = await api().get("/analytics/teacher/overview").set(bearer(teacher.token));
    expect(mine.body.totals).toMatchObject({ courses: 0, enrollments: 0, revenue: 0 });

    const student = await register("student");
    expect((await api().get("/analytics/teacher/overview").set(bearer(student.token))).status).toBe(403);
    expect((await api().get("/analytics/teacher/overview")).status).toBe(401);
    expect((await api().get("/analytics/teacher/overview").query({ months: 99 }).set(bearer(teacher.token))).status).toBe(400);
  });
});

describe("database business rules", () => {
  it("enforces the 3-courses-in-progress limit with a trigger, for every write path", async () => {
    const teacher = await register("teacher");
    const student = await register("student");
    for (let i = 0; i < 3; i++) await enroll(student.id, await insertCourse(teacher.id));
    const fourth = await insertCourse(teacher.id);

    await expect(pool.query("INSERT INTO `join` (`courseId`, `studentId`) VALUES (?, ?)", [fourth, student.id])).rejects.toMatchObject({ sqlState: "45000" });

    // finishing a course frees a slot
    await pool.query("UPDATE `join` SET `progress` = 100 WHERE `studentId` = ? LIMIT 1", [student.id]);
    await expect(pool.query("INSERT INTO `join` (`courseId`, `studentId`) VALUES (?, ?)", [fourth, student.id])).resolves.toBeDefined();
  });

  it("accepts the question type the teacher UI sends", async () => {
    const teacher = await register("teacher");
    const courseId = await insertCourse(teacher.id);
    const [section] = await pool.query<any>("INSERT INTO `section` (`name`, `teacherId`, `courseId`) VALUES ('s', ?, ?)", [teacher.id, courseId]);
    const [quiz] = await pool.query<any>("INSERT INTO `quiz` (`name`, `teacherId`, `sectionId`) VALUES (?, ?, ?)", [`q${unique()}`, teacher.id, section.insertId]);
    await expect(
      pool.query("INSERT INTO `question` (`id`, `quizId`, `type`, `answer`, `content`, `teacherId`) VALUES (?, ?, 'fill in blank', 'x', 'c', ?)", [900000 + Math.floor(Math.random() * 90000), quiz.insertId, teacher.id])
    ).resolves.toBeDefined();
  });
});
