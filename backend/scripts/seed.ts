/**
 * Demo data: 3 teachers, 30 students, 7 courses with sections / lectures / quizzes, a year of
 * enrollments, quiz attempts and payments, plus two roadmaps.
 *
 *   npm run db:seed              # only on an empty database
 *   npm run db:seed -- --reset   # wipe everything first
 *
 * Deterministic (seeded PRNG), so every run produces the same dataset.
 * Every account uses the password printed at the end.
 */
import bcrypt from "bcrypt";
import type { PoolConnection } from "mysql2/promise";
import { pool } from "../src/db/db";
import { generateCode } from "../src/certificate/certificate.service";
import { runMigrations } from "../src/db/migrate";

const DEMO_PASSWORD = "Passw0rd!";

const TABLES = [
  "answerRecord", "dO", "interact", "lecture", "option", "question", "quiz", "section", "payment", "join",
  "certification", "roadCertification", "includeCourse", "requireCourse", "viewRoadMap", "roadMap",
  "courseTopic", "course", "teacherQualification", "student", "teacher", "user",
];

// ---------- deterministic randomness ----------
let state = 42;
const rand = () => {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const pick = <T,>(items: T[]) => items[int(0, items.length - 1)];
const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = int(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const day = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

// ---------- content ----------
type Item = { q: string; a: string; wrong: string[]; fill?: boolean };

const teachers = [
  { first: "Nguyễn Văn", last: "An", username: "gv.an" },
  { first: "Trần Thị", last: "Bình", username: "gv.binh" },
  { first: "Lê Minh", last: "Châu", username: "gv.chau" },
];

const courses: {
  code: string; name: string; teacher: number; price: number; lang: string; desc: string;
  topics: string[]; sections: string[]; bank: Item[];
}[] = [
  {
    code: "CO2013", name: "Hệ cơ sở dữ liệu", teacher: 0, price: 499000, lang: "Tiếng Việt",
    desc: "Mô hình quan hệ, SQL, chuẩn hóa và tối ưu truy vấn.", topics: ["SQL", "Database", "Normalization"],
    sections: ["Mô hình ER", "Đại số quan hệ", "SQL nâng cao", "Chuẩn hóa"],
    bank: [
      { q: "Dạng chuẩn nào yêu cầu mọi thuộc tính không khóa phụ thuộc đầy đủ vào khóa chính?", a: "2NF", wrong: ["1NF", "3NF", "BCNF"] },
      { q: "Phép toán nào trong đại số quan hệ dùng để chọn các bộ thỏa điều kiện?", a: "σ (chọn)", wrong: ["π (chiếu)", "⋈ (kết)", "∪ (hợp)"] },
      { q: "Mệnh đề SQL nào dùng để lọc nhóm sau GROUP BY?", a: "HAVING", wrong: ["WHERE", "ORDER BY", "DISTINCT"] },
      { q: "Khóa ngoại dùng để làm gì?", a: "Ràng buộc tham chiếu giữa hai bảng", wrong: ["Tăng tốc truy vấn", "Mã hóa dữ liệu", "Sao lưu dữ liệu"] },
      { q: "Viết từ khóa SQL dùng để loại bỏ các dòng trùng lặp trong kết quả SELECT.", a: "DISTINCT", wrong: [], fill: true },
      { q: "Trong ACID, chữ A đại diện cho thuộc tính nào?", a: "Atomicity", wrong: ["Availability", "Authorization", "Aggregation"] },
    ],
  },
  {
    code: "CO2003", name: "Cấu trúc dữ liệu & Giải thuật", teacher: 1, price: 399000, lang: "Tiếng Việt",
    desc: "Danh sách, cây, đồ thị và phân tích độ phức tạp.", topics: ["Algorithms", "Data Structures"],
    sections: ["Danh sách liên kết", "Cây nhị phân tìm kiếm", "Đồ thị", "Độ phức tạp thuật toán"],
    bank: [
      { q: "Độ phức tạp thời gian của tìm kiếm nhị phân là?", a: "O(log n)", wrong: ["O(n)", "O(n log n)", "O(1)"] },
      { q: "Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO?", a: "Stack", wrong: ["Queue", "Heap", "Hash table"] },
      { q: "Duyệt inorder trên cây nhị phân tìm kiếm cho dãy như thế nào?", a: "Tăng dần", wrong: ["Giảm dần", "Ngẫu nhiên", "Theo từng mức"] },
      { q: "Thuật toán sắp xếp nào luôn có độ phức tạp O(n log n)?", a: "Merge sort", wrong: ["Bubble sort", "Quick sort", "Insertion sort"] },
      { q: "BFS trên đồ thị dùng cấu trúc dữ liệu nào?", a: "Queue", wrong: ["Stack", "Heap", "Set"] },
    ],
  },
  {
    code: "CO3117", name: "Machine Learning cơ bản", teacher: 2, price: 699000, lang: "English",
    desc: "Hồi quy, phân loại, đánh giá mô hình với Python.", topics: ["AI", "Python", "Statistics"],
    sections: ["Hồi quy", "Phân loại", "Đánh giá mô hình"],
    bank: [
      { q: "Hồi quy tuyến tính dự đoán loại đầu ra nào?", a: "Giá trị liên tục", wrong: ["Nhãn rời rạc", "Cụm", "Chuỗi ký tự"] },
      { q: "Overfitting xảy ra khi mô hình như thế nào?", a: "Khớp quá mức dữ liệu huấn luyện", wrong: ["Quá đơn giản", "Không có dữ liệu", "Dùng quá ít tham số"] },
      { q: "Thang đo nào phù hợp bài toán phân loại?", a: "Accuracy", wrong: ["MSE", "RMSE", "R²"] },
      { q: "Hàm kích hoạt sigmoid cho đầu ra trong khoảng nào?", a: "(0, 1)", wrong: ["(-1, 1)", "(0, ∞)", "(-∞, ∞)"] },
      { q: "Tập validation dùng để làm gì?", a: "Chọn siêu tham số", wrong: ["Huấn luyện mô hình", "Thu thập dữ liệu", "Triển khai"] },
    ],
  },
  {
    code: "CO3093", name: "Mạng máy tính", teacher: 1, price: 449000, lang: "Tiếng Việt",
    desc: "Mô hình phân tầng, TCP/IP, định tuyến và ứng dụng mạng.", topics: ["Network", "TCP/IP"],
    sections: ["Tầng ứng dụng", "Tầng giao vận", "Tầng mạng"],
    bank: [
      { q: "Giao thức nào đảm bảo truyền dữ liệu tin cậy?", a: "TCP", wrong: ["UDP", "IP", "ICMP"] },
      { q: "Cổng mặc định của HTTPS là?", a: "443", wrong: ["80", "21", "25"] },
      { q: "Địa chỉ IPv4 gồm bao nhiêu bit?", a: "32", wrong: ["16", "64", "128"] },
      { q: "DNS dùng để làm gì?", a: "Phân giải tên miền thành địa chỉ IP", wrong: ["Mã hóa đường truyền", "Cấp phát địa chỉ IP", "Định tuyến gói tin"] },
      { q: "Thiết bị nào hoạt động ở tầng mạng?", a: "Router", wrong: ["Hub", "Repeater", "Cáp xoắn đôi"] },
    ],
  },
  {
    code: "CO2017", name: "Hệ điều hành", teacher: 0, price: 549000, lang: "Tiếng Việt",
    desc: "Tiến trình, lập lịch, đồng bộ hóa và quản lý bộ nhớ.", topics: ["Operating System", "Concurrency"],
    sections: ["Tiến trình và luồng", "Lập lịch CPU", "Đồng bộ hóa", "Quản lý bộ nhớ"],
    bank: [
      { q: "Tiến trình ở trạng thái nào khi đang chờ được cấp CPU?", a: "Ready", wrong: ["Running", "Blocked", "Terminated"] },
      { q: "Deadlock cần đồng thời bao nhiêu điều kiện Coffman?", a: "4", wrong: ["2", "3", "5"] },
      { q: "Thuật toán lập lịch nào chia CPU theo lượng tử thời gian?", a: "Round Robin", wrong: ["FCFS", "SJF", "Priority"] },
      { q: "Bộ nhớ ảo thường dùng kỹ thuật nào?", a: "Phân trang theo yêu cầu", wrong: ["Nén dữ liệu", "Mã hóa trang", "Sao chép tiến trình"] },
      { q: "Semaphore dùng để làm gì?", a: "Đồng bộ hóa tiến trình", wrong: ["Cấp phát bộ nhớ", "Mã hóa tệp", "Lập lịch CPU"] },
    ],
  },
  {
    code: "CO2007", name: "Kiến trúc máy tính", teacher: 2, price: 349000, lang: "Tiếng Việt",
    desc: "Tập lệnh, pipeline, bộ nhớ đệm và hệ thống nhớ.", topics: ["Computer Architecture"],
    sections: ["Tập lệnh", "Pipeline", "Bộ nhớ đệm"],
    bank: [
      { q: "Thanh ghi PC (Program Counter) chứa gì?", a: "Địa chỉ lệnh kế tiếp", wrong: ["Kết quả phép tính", "Địa chỉ dữ liệu", "Cờ trạng thái"] },
      { q: "Loại bộ nhớ nào truy cập nhanh nhất?", a: "Thanh ghi", wrong: ["Cache L2", "RAM", "SSD"] },
      { q: "Kiến trúc nào tách riêng bộ nhớ lệnh và dữ liệu?", a: "Harvard", wrong: ["Von Neumann", "RISC-V", "CISC"] },
      { q: "Pipeline giúp cải thiện điều gì?", a: "Thông lượng thực thi lệnh", wrong: ["Dung lượng RAM", "Độ trễ mỗi lệnh", "Kích thước cache"] },
      { q: "Đơn vị nào thực hiện phép toán số học và logic?", a: "ALU", wrong: ["Control Unit", "MMU", "DMA"] },
    ],
  },
  {
    code: "CO1005", name: "Nhập môn Python", teacher: 2, price: 0, lang: "Tiếng Việt",
    desc: "Khóa học miễn phí giúp làm quen với lập trình Python.", topics: ["Python", "Programming"],
    sections: ["Biến và kiểu dữ liệu", "Cấu trúc điều khiển", "Hàm"],
    bank: [
      { q: "Kiểu dữ liệu nào không thể thay đổi sau khi tạo trong Python?", a: "tuple", wrong: ["list", "dict", "set"] },
      { q: "Hàm nào in dữ liệu ra màn hình?", a: "print()", wrong: ["echo()", "write()", "out()"] },
      { q: "Chỉ mục đầu tiên của một list là?", a: "0", wrong: ["1", "-1", "Tùy chọn"] },
      { q: "Từ khóa nào dùng để định nghĩa hàm?", a: "def", wrong: ["func", "function", "lambda"] },
      { q: "Toán tử // có nghĩa là?", a: "Chia lấy phần nguyên", wrong: ["Chia lấy dư", "Lũy thừa", "Chia số thực"] },
    ],
  },
];

const families = ["Nguyễn Văn", "Trần Thị", "Lê Hoàng", "Phạm Gia", "Võ Thảo", "Đặng Minh", "Bùi Quang", "Hoàng Anh", "Phan Ngọc", "Vũ Đức"];
const givens = ["Huy", "Nhi", "Khoa", "Linh", "Phúc", "Trang", "Đạt", "Mai", "Long", "Hạnh", "Tuấn", "Vy", "Nam", "Thảo", "Bảo"];

async function bulk(conn: PoolConnection, table: string, columns: string[], rows: unknown[][]) {
  const cols = columns.map((c) => `\`${c}\``).join(", ");
  for (let i = 0; i < rows.length; i += 400) {
    await conn.query(`INSERT INTO \`${table}\` (${cols}) VALUES ?`, [rows.slice(i, i + 400)]);
  }
}

async function main() {
  await runMigrations(pool, (m) => console.log(m));
  const reset = process.argv.includes("--reset");

  const conn = await pool.getConnection();
  try {
    const [[existing]] = (await conn.query("SELECT COUNT(*) AS n FROM `user`")) as any;
    if (existing.n > 0 && !reset) {
      console.error("Database already has data. Re-run with --reset to wipe it first.");
      process.exitCode = 1;
      return;
    }
    if (reset) {
      await conn.query("SET FOREIGN_KEY_CHECKS = 0");
      for (const table of TABLES) await conn.query(`TRUNCATE TABLE \`${table}\``);
      await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    }

    await conn.beginTransaction();
    const passwordHash = () => bcrypt.hash(DEMO_PASSWORD, 10);

    // ----- users -----
    const userRows: unknown[][] = [];
    const teacherIds: number[] = [];
    const studentIds: number[] = [];
    let nextUser = 1;

    for (const t of teachers) {
      userRows.push([nextUser, `${t.username}@hcmut.edu.vn`, t.first, t.last, t.username, await passwordHash(), "teacher", "Vietcombank", `0071000${int(100000, 999999)}`]);
      teacherIds.push(nextUser++);
    }
    for (let i = 1; i <= 30; i++) {
      const username = `sv${String(i).padStart(3, "0")}`;
      userRows.push([nextUser, `${username}@student.hcmut.edu.vn`, pick(families), pick(givens), username, await passwordHash(), "student", pick(["Vietcombank", "Techcombank", "MB Bank", "ACB"]), `${int(10 ** 9, 10 ** 10 - 1)}`]);
      studentIds.push(nextUser++);
    }
    await bulk(conn, "user", ["id", "email", "firstName", "lastName", "username", "password", "role", "bankName", "bankAccount"], userRows);
    await bulk(conn, "teacher", ["userId", "teacherId"], teacherIds.map((id, i) => [id, `GV${String(i + 1).padStart(4, "0")}`]));
    await bulk(conn, "student", ["userId", "studentId", "enrollmentDate"], studentIds.map((id, i) => [id, `SV${2200000 + i + 1}`, day(int(400, 700))]));
    await bulk(conn, "teacherQualification", ["teacherId", "qualification"], [[teacherIds[0], "Tiến sĩ Khoa học Máy tính"], [teacherIds[1], "Thạc sĩ Công nghệ Thông tin"], [teacherIds[2], "Tiến sĩ Trí tuệ nhân tạo"]]);

    // ----- catalog -----
    type QuizInfo = { id: number; sectionId: number; lectureIds: number[]; questions: { id: number; type: string; answer: string; wrong: string[] }[] };
    const courseInfo: { id: number; name: string; price: number; teacherId: number; quizzes: QuizInfo[] }[] = [];
    const courseRows: unknown[][] = [], topicRows: unknown[][] = [], sectionRows: unknown[][] = [], lectureRows: unknown[][] = [];
    const quizRows: unknown[][] = [], questionRows: unknown[][] = [], optionRows: unknown[][] = [];
    let courseId = 0, sectionId = 0, quizId = 0, questionId = 0, lectureId = 0;

    for (const c of courses) {
      courseId++;
      const teacherId = teacherIds[c.teacher];
      courseRows.push([courseId, `${c.name}`, c.lang, c.desc, teacherId, day(int(300, 420)), 0, c.price]);
      c.topics.forEach((topic) => topicRows.push([courseId, topic]));
      const info = { id: courseId, name: c.name, price: c.price, teacherId, quizzes: [] as QuizInfo[] };

      c.sections.forEach((sectionName, index) => {
        sectionId++;
        sectionRows.push([sectionId, `Section ${index + 1}: ${sectionName}`, 2, 12, teacherId, courseId, day(int(250, 400))]);
        const lectureIds: number[] = [];
        for (let lesson = 1; lesson <= 2; lesson++) {
          lectureIds.push(++lectureId);
          lectureRows.push([
            lectureId, `Bài ${lesson}: ${sectionName}`, "uncomplete",
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            `https://example.com/docs/${c.code.toLowerCase()}-s${index + 1}-b${lesson}.pdf`, sectionId,
          ]);
        }
        quizId++;
        quizRows.push([quizId, `${c.code} · Quiz section ${index + 1}: ${sectionName}`, "opened", 2, 10, teacherId, sectionId, day(int(200, 380))]);
        const quiz: QuizInfo = { id: quizId, sectionId, lectureIds, questions: [] };
        for (let k = 0; k < 5; k++) {
          const item = c.bank[(index + k) % c.bank.length];
          questionId++;
          const type = item.fill ? "fill in blank" : "multiple choice";
          questionRows.push([questionId, quizId, type, item.a, item.q, day(int(200, 380)), teacherId]);
          if (!item.fill) shuffle([item.a, ...item.wrong]).forEach((text) => optionRows.push([questionId, text]));
          quiz.questions.push({ id: questionId, type, answer: item.a, wrong: item.wrong });
        }
        info.quizzes.push(quiz);
      });
      courseInfo.push(info);
    }

    await bulk(conn, "course", ["id", "name", "language", "description", "teacherId", "creTime", "avgQuiz", "price"], courseRows);
    await bulk(conn, "courseTopic", ["courseId", "topic"], topicRows);
    await bulk(conn, "section", ["id", "name", "numOfLecture", "timeTocomplete", "teacherId", "courseId", "creTime"], sectionRows);
    await bulk(conn, "lecture", ["id", "name", "state", "material", "reference", "sectionId"], lectureRows);
    await bulk(conn, "quiz", ["id", "name", "state", "attempt", "duration", "teacherId", "sectionId", "creTime"], quizRows);
    await bulk(conn, "question", ["id", "quizId", "type", "answer", "content", "creTime", "teacherId"], questionRows);
    await bulk(conn, "option", ["questionId", "option"], optionRows);

    // ----- enrollments, attempts, payments -----
    const joinRows: unknown[][] = [], doRows: unknown[][] = [], answerRows: unknown[][] = [], paymentRows: unknown[][] = [];
    const interactRows: unknown[][] = [], certificateRows: unknown[][] = [];
    const usedCodes = new Set<string>();
    let orderCode = Date.now() * 1000;

    for (const studentId of studentIds) {
      const chosen = shuffle(courseInfo).slice(0, int(1, 4));
      const plans = chosen.map((course) => {
        const total = course.quizzes.length;
        const roll = rand();
        let done = roll < 0.3 ? total : roll < 0.8 ? int(1, total - 1) : 0;
        return { course, done, total };
      });
      // the database allows at most 3 courses in progress per student
      let inProgress = 0;
      for (const plan of plans) {
        if (plan.done < plan.total) {
          if (inProgress >= 3) plan.done = plan.total;
          else inProgress++;
        }
      }
      plans.sort((a, b) => Number(b.done === b.total) - Number(a.done === a.total)); // completed rows first

      for (const { course, done, total } of plans) {
        const startedDaysAgo = Math.floor((1 - Math.sqrt(rand())) * 355) + 5; // more recent enrollments than old ones
        const dateStart = day(startedDaysAgo);
        const perQuizAverages: number[] = [];

        // finished sections: every lecture watched, in order, between enrollment and now
        course.quizzes.slice(0, done).forEach((quiz, index) => {
          quiz.lectureIds.forEach((id, lesson) => {
            const watchedDaysAgo = Math.max(1, startedDaysAgo - index * 3 - lesson - 1);
            interactRows.push([id, studentId, int(300, 1800), `${day(watchedDaysAgo)} 20:00:00`]);
          });
        });
        // the next lecture is half watched, so "continue learning" has somewhere to resume from
        const resuming = course.quizzes[done];
        if (resuming && rand() < 0.7) interactRows.push([resuming.lectureIds[0], studentId, int(40, 600), null]);

        course.quizzes.slice(0, done).forEach((quiz) => {
          const first = [2, 4, 4, 6, 8, 8, 10][int(0, 6)];
          const scores = [first];
          if (first < 8 && rand() < 0.35) scores.push(Math.min(10, first + [2, 4][int(0, 1)]));
          scores.forEach((score, i) => doRows.push([quiz.id, studentId, score, i + 1]));
          perQuizAverages.push(scores.reduce((a, b) => a + b, 0) / scores.length);

          const correct = Math.round(scores[scores.length - 1] / 2);
          quiz.questions.forEach((q, i) => {
            const answer = i < correct ? q.answer : q.wrong.length ? pick(q.wrong) : "sai";
            answerRows.push([quiz.id, studentId, q.id, answer]);
          });
        });

        const progress = Math.round((done / total) * 100);
        const gpa = perQuizAverages.length ? perQuizAverages.reduce((a, b) => a + b, 0) / perQuizAverages.length : null;
        const completedOn = progress === 100 ? day(Math.max(0, startedDaysAgo - int(10, 60))) : null;
        const grade = gpa === null ? null : Math.round(gpa * 100) / 100;
        joinRows.push([course.id, studentId, dateStart, completedOn, progress, grade]);
        // same rule as the application: finished and an average of at least 5 earns a certificate
        if (progress === 100 && grade !== null && grade >= 5) {
          let code = generateCode();
          while (usedCodes.has(code)) code = generateCode();
          usedCodes.add(code);
          certificateRows.push([course.name.slice(0, 50), completedOn, course.id, studentId, code, grade]);
        }
        if (course.price > 0) {
          paymentRows.push([++orderCode, studentId, course.id, course.price, "PAID", `${dateStart} 12:00:00`, `${dateStart} 12:00:00`]);
        }
      }
    }

    // the trigger counts earlier rows of the same student, so completed courses must go in before in-progress ones
    joinRows.sort((a, b) => Number((b[4] as number) === 100) - Number((a[4] as number) === 100));
    await bulk(conn, "join", ["courseId", "studentId", "dateStart", "dateComplete", "progress", "GPA"], joinRows);
    await bulk(conn, "dO", ["quizId", "studentId", "score", "attemptOrder"], doRows);
    await bulk(conn, "answerRecord", ["quizId", "studentId", "questionId", "studentAns"], answerRows);
    await bulk(conn, "payment", ["orderCode", "studentId", "courseId", "amount", "status", "createdAt", "paidAt"], paymentRows);
    await bulk(conn, "interact", ["lectureId", "studentId", "positionSeconds", "completedAt"], interactRows);
    await bulk(conn, "certification", ["name", "issueDate", "courseId", "studentId", "code", "grade"], certificateRows);

    // ----- roadmaps -----
    await bulk(conn, "roadMap", ["id", "instruction", "description", "name", "teacherId"], [
      [1, "Hoàn thành lần lượt các khóa học theo thứ tự để nhận chứng chỉ lộ trình.", "Từ nền tảng cơ sở dữ liệu đến học máy.", "Kỹ sư Dữ liệu", teacherIds[0]],
      [2, "Đi từ kiến trúc máy tính đến hệ điều hành và mạng.", "Nền tảng cho kỹ sư hệ thống.", "Kỹ sư Hệ thống", teacherIds[1]],
    ]);
    const byCode = (code: string) => courses.findIndex((c) => c.code === code) + 1;
    await bulk(conn, "includeCourse", ["rmId", "courseId", "order"], [
      [1, byCode("CO2013"), 1], [1, byCode("CO2003"), 2], [1, byCode("CO3117"), 3],
      [2, byCode("CO2007"), 1], [2, byCode("CO2017"), 2], [2, byCode("CO3093"), 3],
    ]);

    // ----- derived columns the app normally maintains -----
    await conn.query(
      `UPDATE \`course\` c SET c.\`avgQuiz\` = COALESCE((
         SELECT ROUND(AVG(d.\`score\`)) FROM \`dO\` d JOIN \`quiz\` q ON q.\`id\` = d.\`quizId\`
         JOIN \`section\` s ON s.\`id\` = q.\`sectionId\` WHERE s.\`courseId\` = c.\`id\`), 0)`
    );
    await conn.query(
      `UPDATE \`student\` st SET
         st.\`numberCoursesEnrolled\` = (SELECT COUNT(*) FROM \`join\` j WHERE j.\`studentId\` = st.\`userId\`),
         st.\`numberCoursesCompleted\` = (SELECT COUNT(*) FROM \`join\` j WHERE j.\`studentId\` = st.\`userId\` AND j.\`progress\` = 100)`
    );

    await conn.commit();

    console.log(`\nSeeded ${teachers.length} teachers, ${studentIds.length} students, ${courses.length} courses, ${quizRows.length} quizzes, ${questionRows.length} questions, ${joinRows.length} enrollments, ${doRows.length} quiz attempts, ${certificateRows.length} certificates.`);
    console.log(`\nLog in with password "${DEMO_PASSWORD}":`);
    console.log("  teachers: gv.an, gv.binh, gv.chau");
    console.log("  students: sv001 … sv030");
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
