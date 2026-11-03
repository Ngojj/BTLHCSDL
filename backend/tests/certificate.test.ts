import { describe, expect, it } from "vitest";
import { pool } from "../src/db/db";
import { renderCertificatePdf } from "../src/certificate/certificate.pdf";
import { CODE_PATTERN, generateCode } from "../src/certificate/certificate.service";
import { api, bearer, enroll, insertCourse, insertLecture, insertSection, register, rows } from "./helpers";

/** A student who has just finished a lecture-only course, which issues a certificate. */
async function certifiedStudent(courseName?: string) {
  const teacher = await register("teacher");
  const student = await register("student");
  const courseId = await insertCourse(teacher.id, { name: courseName });
  const section = await insertSection(courseId, teacher.id);
  const lecture = await insertLecture(section);
  await enroll(student.id, courseId);
  const done = await api().put(`/progress/lecture/${lecture}`).set(bearer(student.token)).send({ positionSeconds: 60, completed: true });
  const code = done.body.course.certificateCode as string;
  return { teacher, student, courseId, code };
}

describe("certificate codes", () => {
  it("are well formed, unambiguous and do not repeat", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 2000; i++) {
      const code = generateCode();
      expect(code).toMatch(CODE_PATTERN);
      expect(code.slice(3).replace(/-/g, "")).not.toMatch(/[ILOU01]/);
      seen.add(code);
    }
    expect(seen.size).toBe(2000);
  });

  it("allow only one certificate per student and course in the database", async () => {
    const { student, courseId } = await certifiedStudent();
    await expect(
      pool.query("INSERT INTO `certification` (`name`, `courseId`, `studentId`, `code`) VALUES ('dup', ?, ?, ?)", [courseId, student.id, generateCode()])
    ).rejects.toMatchObject({ code: "ER_DUP_ENTRY" });
  });
});

describe("public verification", () => {
  it("confirms a genuine certificate without needing to log in", async () => {
    const { code } = await certifiedStudent("Hệ cơ sở dữ liệu");
    const res = await api().get(`/certificate/verify/${code}`);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.certificate).toMatchObject({ code, courseName: "Hệ cơ sở dữ liệu", studentName: "Test User", grade: null });
    expect(res.body.certificate.issuedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // nothing that identifies the account beyond what is printed on the certificate
    expect(JSON.stringify(res.body)).not.toContain("@");
    expect(res.body.certificate).not.toHaveProperty("studentId");
  });

  it("accepts the code in any letter case and with surrounding spaces", async () => {
    const { code } = await certifiedStudent();
    expect((await api().get(`/certificate/verify/${code.toLowerCase()}`)).status).toBe(200);
    expect((await api().get(`/certificate/verify/%20${code}%20`)).status).toBe(200);
  });

  it("rejects malformed and unknown codes", async () => {
    expect((await api().get("/certificate/verify/not-a-code")).status).toBe(400);
    expect((await api().get("/certificate/verify/BK-AAAA-BBBB-CCCC")).status).toBe(404);
  });
});

describe("listings", () => {
  it("shows each student only their own certificates and each teacher only their own course's", async () => {
    const a = await certifiedStudent("Course A");
    const b = await certifiedStudent("Course B");

    const mineA = await api().get("/certificate/mine").set(bearer(a.student.token));
    expect(mineA.body.data.map((c: any) => c.code)).toEqual([a.code]);

    const issuedA = await api().get("/certificate/issued").set(bearer(a.teacher.token));
    expect(issuedA.body.data.map((c: any) => c.code)).toEqual([a.code]);
    expect(issuedA.body.data[0].studentName).toBe("Test User");
    expect(issuedA.body.data.map((c: any) => c.code)).not.toContain(b.code);
  });

  it("is limited by role", async () => {
    const { student, teacher } = await certifiedStudent();
    expect((await api().get("/certificate/mine").set(bearer(teacher.token))).status).toBe(403);
    expect((await api().get("/certificate/issued").set(bearer(student.token))).status).toBe(403);
    expect((await api().get("/certificate/mine")).status).toBe(401);
  });

  it("no longer lets teachers hand out certificates by hand", async () => {
    const { teacher, student, courseId } = await certifiedStudent();
    const res = await api().post("/certification/create").set(bearer(teacher.token)).send({ name: "fake", courseId, studentId: student.id });
    expect(res.status).toBe(404);
  });
});

describe("PDF", () => {
  it("is downloadable by its holder only", async () => {
    const { code, student } = await certifiedStudent("Kiến trúc máy tính");
    const stranger = await register("student");

    const res = await api().get(`/certificate/${code}/pdf`).set(bearer(student.token)).buffer(true).parse((r, cb) => {
      const chunks: Buffer[] = [];
      r.on("data", (c: Buffer) => chunks.push(c));
      r.on("end", () => cb(null, Buffer.concat(chunks)));
    });
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    expect(res.headers["content-disposition"]).toContain(`chung-chi-${code}.pdf`);
    expect((res.body as Buffer).subarray(0, 5).toString()).toBe("%PDF-");
    expect((res.body as Buffer).length).toBeGreaterThan(8_000); // fonts, logo and QR are embedded

    expect((await api().get(`/certificate/${code}/pdf`).set(bearer(stranger.token))).status).toBe(404);
    expect((await api().get(`/certificate/${code}/pdf`)).status).toBe(401);
  });

  it("renders very long names and Vietnamese text without failing", async () => {
    const pdf = await renderCertificatePdf(
      {
        code: generateCode(),
        courseId: 1,
        courseName: "Phân tích và thiết kế hệ thống thông tin quản lý nâng cao dành cho kỹ sư dữ liệu",
        studentName: "Nguyễn Hoàng Phương Thảo Vy Khánh Linh Trần Đặng Bùi",
        teacherName: "Lê Minh Châu",
        issuedAt: "2026-11-02",
        grade: 8.75,
      },
      "https://example.com/verify/BK-AAAA-BBBB-CCCC"
    );
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
