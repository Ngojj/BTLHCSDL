import path from "path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import type { CertificateView } from "./certificate.service";

const NAVY = "#032B91";
const INK = "#0B1B3F";
const SLATE = "#5B6B8C";
const LINE = "#DCE3F0";
const GOLD = "#C9A227";

// resolved from the working directory like docs/ and migrations/, so it also works from the compiled dist/ folder
const asset = (file: string) => path.resolve(process.cwd(), "assets", file);

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

/** A4 landscape certificate with the school logo and a QR code that opens the public verification page. */
export async function renderCertificatePdf(cert: CertificateView, verifyUrl: string): Promise<Buffer> {
  const qr = await QRCode.toBuffer(verifyUrl, { margin: 0, width: 240, color: { dark: NAVY, light: "#FFFFFF" } });

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 0,
    info: { Title: `Chứng chỉ ${cert.courseName}`, Author: "Bách Khoa E-Learning", Subject: `Mã xác minh ${cert.code}` },
  });
  doc.registerFont("regular", asset("fonts/BeVietnamPro-Regular.ttf"));
  doc.registerFont("semibold", asset("fonts/BeVietnamPro-SemiBold.ttf"));
  doc.registerFont("bold", asset("fonts/BeVietnamPro-Bold.ttf"));

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const W = doc.page.width;
  const H = doc.page.height;
  const centered = { align: "center" as const, width: W };

  /** Single line that shrinks until it fits, so long names never overflow the frame. */
  const fitted = (text: string, font: string, size: number, minSize: number, maxWidth: number) => {
    doc.font(font);
    let fontSize = size;
    while (fontSize > minSize && doc.fontSize(fontSize).widthOfString(text) > maxWidth) fontSize -= 1;
    return fontSize;
  };

  // frame: a navy rule with a hairline inside
  doc.lineWidth(1.5).strokeColor(NAVY).rect(24, 24, W - 48, H - 48).stroke();
  doc.lineWidth(0.5).strokeColor(LINE).rect(32, 32, W - 64, H - 64).stroke();

  // letterhead
  doc.image(asset("logoBK.png"), 64, 54, { height: 56 });
  doc.font("semibold").fontSize(11).fillColor(NAVY).text("TRƯỜNG ĐẠI HỌC BÁCH KHOA — ĐHQG TP.HCM", 130, 68, { lineBreak: false });
  doc.font("regular").fontSize(8.5).fillColor(SLATE).text("BÁCH KHOA E-LEARNING", 130, 86, { characterSpacing: 2, lineBreak: false });

  // title
  doc.font("bold").fontSize(31).fillColor(NAVY).text("CHỨNG CHỈ HOÀN THÀNH", 0, 138, { ...centered, characterSpacing: 3 });
  doc.lineWidth(1.5).strokeColor(GOLD).moveTo(W / 2 - 28, 186).lineTo(W / 2 + 28, 186).stroke();

  // recipient
  doc.font("regular").fontSize(12.5).fillColor(SLATE).text("Chứng nhận", 0, 208, centered);
  const nameSize = fitted(cert.studentName, "bold", 36, 20, W - 160);
  doc.font("bold").fontSize(nameSize).fillColor(INK).text(cert.studentName, 0, 232, { ...centered, lineBreak: false });

  doc.font("regular").fontSize(12.5).fillColor(SLATE).text("đã hoàn thành khóa học", 0, 292, centered);
  const courseSize = fitted(cert.courseName, "semibold", 24, 14, W - 160);
  doc.font("semibold").fontSize(courseSize).fillColor(NAVY).text(cert.courseName, 0, 316, { ...centered, lineBreak: false });

  if (cert.grade !== null) {
    doc.font("regular").fontSize(12).fillColor(SLATE).text(`Điểm trung bình quiz: ${cert.grade.toFixed(1).replace(".", ",")} / 10`, 0, 362, centered);
  }

  // footer: date | signature | verification
  doc.font("regular").fontSize(8).fillColor(SLATE).text("NGÀY CẤP", 90, 446, { characterSpacing: 1.5, lineBreak: false });
  doc.font("semibold").fontSize(13).fillColor(INK).text(formatDate(cert.issuedAt), 90, 462, { lineBreak: false });

  // signature sits in its own column between the date and the verification block
  const signX = 215;
  const signWidth = 170;
  doc.lineWidth(0.5).strokeColor(SLATE).moveTo(signX, 478).lineTo(signX + signWidth, 478).stroke();
  doc.font("semibold").fontSize(12).fillColor(INK).text(cert.teacherName, signX, 486, { width: signWidth, align: "center" });
  doc.font("regular").fontSize(9).fillColor(SLATE).text("Giảng viên phụ trách", signX, 503, { width: signWidth, align: "center" });

  const qrSize = 78;
  const qrX = W - 90 - qrSize;
  doc.image(qr, qrX, 436, { width: qrSize });
  const textWidth = 210;
  const textX = qrX - 14 - textWidth;
  doc.font("regular").fontSize(8).fillColor(SLATE).text("MÃ XÁC MINH", textX, 446, { width: textWidth, align: "right", characterSpacing: 1.5, lineBreak: false });
  doc.font("bold").fontSize(13).fillColor(NAVY).text(cert.code, textX, 460, { width: textWidth, align: "right", lineBreak: false });
  doc.font("regular").fontSize(7.5).fillColor(SLATE).text(`Quét mã QR hoặc truy cập\n${verifyUrl}`, textX, 482, { width: textWidth, align: "right" });

  doc.end();
  return finished;
}
