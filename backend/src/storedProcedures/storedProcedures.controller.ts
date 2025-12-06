import { Request, Response } from "express";
import storedProceduresService from "./storedProcedures.service";

class StoredProceduresController {
  // ========== PHẦN 2.1: CRUD ==========
  
  public courseInsert = async (req: Request, res: Response) => {
    try {
      const { name, language, description, teacherId, price } = req.body;
      
      if (!name || !language || !description || !teacherId || price === undefined) {
        return res.status(400).json({
          message: "Thiếu thông tin bắt buộc: name, language, description, teacherId, price",
        });
      }

      const result = await storedProceduresService.courseInsert(
        name,
        language,
        description,
        teacherId,
        price
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  };

  public courseUpdate = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { name, language, description, price } = req.body;

      if (!courseId || !name || !language || !description || price === undefined) {
        return res.status(400).json({
          message: "Thiếu thông tin bắt buộc: courseId, name, language, description, price",
        });
      }

      const result = await storedProceduresService.courseUpdate(
        parseInt(courseId),
        name,
        language,
        description,
        price
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  };

  public courseDelete = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        return res.status(400).json({
          message: "Thiếu courseId",
        });
      }

      const result = await storedProceduresService.courseDelete(
        parseInt(courseId)
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  };

  // ========== PHẦN 2.3: Thủ tục truy vấn ==========

  public listCoursesByTeacher = async (req: Request, res: Response) => {
    try {
      const { teacherId, minPrice } = req.query;

      if (!teacherId) {
        return res.status(400).json({
          message: "Thiếu teacherId",
        });
      }

      const result = await storedProceduresService.listCoursesByTeacher(
        parseInt(teacherId as string),
        minPrice ? parseInt(minPrice as string) : 0
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  };

  public studentProgressSummary = async (req: Request, res: Response) => {
    try {
      const { minProgress } = req.query;

      const result = await storedProceduresService.studentProgressSummary(
        minProgress ? parseInt(minProgress as string) : 0
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  };

  // ========== PHẦN 2.4: Hàm ==========

  public getTotalSpent = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;

      if (!studentId) {
        return res.status(400).json({
          message: "Thiếu studentId",
        });
      }

      const result = await storedProceduresService.getTotalSpent(
        parseInt(studentId)
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  };

  public checkPrereqMet = async (req: Request, res: Response) => {
    try {
      const { courseId, studentId } = req.query;

      if (!courseId || !studentId) {
        return res.status(400).json({
          message: "Thiếu courseId hoặc studentId",
        });
      }

      const result = await storedProceduresService.checkPrereqMet(
        parseInt(courseId as string),
        parseInt(studentId as string)
      );

      return res.status(result.status).json(result);
    } catch (error: any) {
      return res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  };
}

export default new StoredProceduresController();

