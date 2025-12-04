import { Router } from "express";
import optionController from "./option.controller";

const router = Router()

// get all options
router.get('/', optionController.getAllOptions as any)

// get option by question id
router.get('/id/:questionId', optionController.getOptionByQuestionId as any)

// create option
router.post('/create', optionController.createOption as any)

// update option
router.patch('/update', optionController.updateOption as any)

// delete option
router.delete('/delete', optionController.deleteOption as any)
export default router;