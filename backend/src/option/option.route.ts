import { Router } from "express";
import optionController from "./option.controller";
import { asUser, asTeacher } from "../middleware/auth";
import { owns, canViewContent } from "../middleware/access";

const router = Router()

// get all options
router.get('/', asTeacher, optionController.getAllOptions as any);

// get option by question id
router.get('/id/:questionId', asUser, canViewContent("question", "params.questionId"), optionController.getOptionByQuestionId as any);

// create option
router.post('/create', asTeacher, owns("question", "body.questionId"), optionController.createOption as any);

// update option
router.patch('/update', asTeacher, owns("question", "body.questionId"), optionController.updateOption as any);

// delete option
router.delete('/delete', asTeacher, owns("question", "body.questionId"), optionController.deleteOption as any);
export default router;