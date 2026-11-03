import { randomInt } from "crypto";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { pool } from "../db/db";
import { logger } from "../lib/logger";

// No I, L, O, U, 0 or 1: a code stays unambiguous when printed, read aloud or typed from a screenshot.
const ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
export const CODE_PATTERN = /^BK-[ABCDEFGHJKMNPQRSTVWXYZ2-9]{4}-[ABCDEFGHJKMNPQRSTVWXYZ2-9]{4}-[ABCDEFGHJKMNPQRSTVWXYZ2-9]{4}$/;

const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

/** 30^12 ≈ 5·10^17 possibilities from a CSPRNG: the code is unguessable, the database is the source of truth. */
export const generateCode = () => `BK-${group()}-${group()}-${group()}`;

export interface CertificateView {
  code: string;
  courseId: number;
  courseName: string;
  studentName: string;
  teacherName: string;
  issuedAt: string; // YYYY-MM-DD
  grade: number | null;
}

const SELECT_VIEW = `
  SELECT c.\`code\`, c.\`grade\`, DATE_FORMAT(c.\`issueDate\`, '%Y-%m-%d') AS issuedAt,
         co.\`id\` AS courseId, co.\`name\` AS courseName,
         CONCAT(su.\`firstName\`, ' ', su.\`lastName\`) AS studentName,
         CONCAT(tu.\`firstName\`, ' ', tu.\`lastName\`) AS teacherName
    FROM \`certification\` c
    JOIN \`course\` co ON co.\`id\` = c.\`courseId\`
    JOIN \`user\` su ON su.\`id\` = c.\`studentId\`
    JOIN \`user\` tu ON tu.\`id\` = co.\`teacherId\``;

const toView = (row: RowDataPacket): CertificateView => ({
  code: row.code,
  courseId: row.courseId,
  courseName: row.courseName,
  studentName: row.studentName,
  teacherName: row.teacherName,
  issuedAt: row.issuedAt,
  grade: row.grade === null ? null : Number(row.grade),
});

/**
 * Issues the certificate for a finished course, exactly once. Must run inside the transaction that holds the
 * (course, student) enrollment row lock, which is what makes the check-then-insert below race-free.
 * Returns the code of the new or already existing certificate.
 */
export async function issueCertificate(conn: PoolConnection, studentId: number, courseId: number, grade: number | null): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const [existing] = await conn.query<RowDataPacket[]>(
      "SELECT `id`, `code` FROM `certification` WHERE `studentId` = ? AND `courseId` = ?",
      [studentId, courseId]
    );
    if (existing[0]?.code) return existing[0].code;

    const code = generateCode();
    try {
      if (existing[0]) {
        // a legacy row created before codes existed
        await conn.query("UPDATE `certification` SET `code` = ?, `grade` = ? WHERE `id` = ?", [code, grade, existing[0].id]);
      } else {
        await conn.query(
          "INSERT INTO `certification` (`name`, `issueDate`, `courseId`, `studentId`, `code`, `grade`) SELECT LEFT(`name`, 50), CURDATE(), `id`, ?, ?, ? FROM `course` WHERE `id` = ?",
          [studentId, code, grade, courseId]
        );
      }
      logger.info({ studentId, courseId, code }, "certificate issued");
      return code;
    } catch (error: any) {
      // a duplicate means either the code collided or a concurrent request just issued this certificate:
      // look again at the top of the loop instead of guessing which
      if (error?.code !== "ER_DUP_ENTRY") throw error;
    }
  }
  throw new Error("could not generate a unique certificate code");
}

/** Public: what a recruiter sees after scanning the QR code. */
export async function verifyCertificate(code: string): Promise<CertificateView | null> {
  const [rows] = await pool.query<RowDataPacket[]>(`${SELECT_VIEW} WHERE c.\`code\` = ?`, [code]);
  return rows[0] ? toView(rows[0]) : null;
}

export async function listStudentCertificates(studentId: number): Promise<CertificateView[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${SELECT_VIEW} WHERE c.\`studentId\` = ? AND c.\`code\` IS NOT NULL ORDER BY c.\`issueDate\` DESC, c.\`id\` DESC`,
    [studentId]
  );
  return rows.map(toView);
}

/** A teacher sees the certificates issued for their own courses. */
export async function listIssuedByTeacher(teacherId: number): Promise<CertificateView[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${SELECT_VIEW} WHERE co.\`teacherId\` = ? AND c.\`code\` IS NOT NULL ORDER BY c.\`issueDate\` DESC, c.\`id\` DESC`,
    [teacherId]
  );
  return rows.map(toView);
}

/** Only the holder can download the PDF. */
export async function getOwnedCertificate(code: string, studentId: number): Promise<CertificateView | null> {
  const [rows] = await pool.query<RowDataPacket[]>(`${SELECT_VIEW} WHERE c.\`code\` = ? AND c.\`studentId\` = ?`, [code, studentId]);
  return rows[0] ? toView(rows[0]) : null;
}
