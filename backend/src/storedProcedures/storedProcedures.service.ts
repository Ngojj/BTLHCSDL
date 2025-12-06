// Tái sử dụng connection pool từ db.ts (dùng chung với Drizzle)
// Lưu ý: Drizzle không hỗ trợ gọi stored procedures trực tiếp,
// nên cần dùng raw MySQL connection từ pool để gọi CALL và SELECT function
import { pool } from "../db/db";

class StoredProceduresService {
  // ========== PHẦN 2.1: CRUD cho bảng course ==========
  
  /**
   * Gọi sp_course_insert
   */
  public async courseInsert(
    name: string,
    language: string,
    description: string,
    teacherId: number,
    price: number
  ) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `CALL sp_course_insert(?, ?, ?, ?, ?)`,
        [name, language, description, teacherId, price]
      );
      return {
        message: "Thêm khóa học thành công",
        status: 200,
        data: rows,
      };
    } catch (error: any) {
      // Xử lý lỗi từ MySQL SIGNAL
      const errorMessage = error.message || "Lỗi khi thêm khóa học";
      const statusCode = error.code === 'ER_SIGNAL_EXCEPTION' ? 400 : 500;
      return {
        message: errorMessage,
        status: statusCode,
        error: error.message,
        code: error.code,
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Gọi sp_course_update
   */
  public async courseUpdate(
    courseId: number,
    name: string,
    language: string,
    description: string,
    price: number
  ) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `CALL sp_course_update(?, ?, ?, ?, ?)`,
        [courseId, name, language, description, price]
      );
      return {
        message: "Cập nhật khóa học thành công",
        status: 200,
        data: rows,
      };
    } catch (error: any) {
      const errorMessage = error.message || "Lỗi khi cập nhật khóa học";
      const statusCode = error.code === 'ER_SIGNAL_EXCEPTION' ? 400 : 500;
      return {
        message: errorMessage,
        status: statusCode,
        error: error.message,
        code: error.code,
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Gọi sp_course_delete
   */
  public async courseDelete(courseId: number) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(`CALL sp_course_delete(?)`, [
        courseId,
      ]);
      return {
        message: "Xóa khóa học thành công",
        status: 200,
        data: rows,
      };
    } catch (error: any) {
      const errorMessage = error.message || "Lỗi khi xóa khóa học";
      const statusCode = error.code === 'ER_SIGNAL_EXCEPTION' ? 400 : 500;
      return {
        message: errorMessage,
        status: statusCode,
        error: error.message,
        code: error.code,
      };
    } finally {
      connection.release();
    }
  }

  // ========== PHẦN 2.3: Thủ tục truy vấn ==========

  /**
   * Gọi sp_list_courses_by_teacher
   * Thủ tục 1: Truy vấn từ 2 bảng trở lên có WHERE và ORDER BY
   */
  public async listCoursesByTeacher(
    teacherId: number,
    minPrice: number
  ) {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        `CALL sp_list_courses_by_teacher(?, ?)`,
        [teacherId, minPrice]
      );
      // MySQL stored procedure trả về [[result], [fields]]
      // Nếu có nhiều result sets, lấy cái đầu tiên
      const result = Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
      return {
        message: "Lấy danh sách khóa học theo giáo viên thành công",
        status: 200,
        data: result,
      };
    } catch (error: any) {
      return {
        message: error.message || "Lỗi khi lấy danh sách khóa học",
        status: 500,
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Gọi sp_student_progress_summary
   * Thủ tục 2: Có aggregate function, GROUP BY, HAVING, WHERE, ORDER BY, liên kết từ 2 bảng trở lên
   */
  public async studentProgressSummary(minProgress: number) {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        `CALL sp_student_progress_summary(?)`,
        [minProgress]
      );
      // MySQL stored procedure trả về [[result], [fields]]
      const result = Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
      return {
        message: "Lấy tổng quan tiến độ sinh viên thành công",
        status: 200,
        data: result,
      };
    } catch (error: any) {
      return {
        message: error.message || "Lỗi khi lấy tổng quan tiến độ",
        status: 500,
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }

  // ========== PHẦN 2.4: Hàm ==========

  /**
   * Gọi fn_total_spent
   * Hàm 1: Tính tổng tiền sinh viên đã chi cho các khóa học
   */
  public async getTotalSpent(studentId: number) {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        `SELECT fn_total_spent(?) AS totalSpent`,
        [studentId]
      );
      return {
        message: "Tính tổng tiền thành công",
        status: 200,
        data: rows[0]?.totalSpent || 0,
      };
    } catch (error: any) {
      return {
        message: error.message || "Lỗi khi tính tổng tiền",
        status: 500,
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }

  /**
   * Gọi fn_check_prereq_met
   * Hàm 2: Kiểm tra sinh viên đã hoàn thành các môn tiên quyết chưa
   */
  public async checkPrereqMet(courseId: number, studentId: number) {
    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        `SELECT fn_check_prereq_met(?, ?) AS prereqMet`,
        [courseId, studentId]
      );
      return {
        message: "Kiểm tra môn tiên quyết thành công",
        status: 200,
        data: {
          prereqMet: rows[0]?.prereqMet === 1,
          value: rows[0]?.prereqMet,
        },
      };
    } catch (error: any) {
      return {
        message: error.message || "Lỗi khi kiểm tra môn tiên quyết",
        status: 500,
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}

export default new StoredProceduresService();

