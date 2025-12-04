import { Request, Response } from "express";
import optionService from "./option.service";
class optionController {
    public async getOptionByQuestionId(req: Request, res: Response) {
        try {
            const questionId = req.params.questionId;
            const questions = await optionService.getOptionByQuestionId(Number(questionId));

            return res.status(200).json({
                message: "Successfully fetched option",
                data: questions,
                status: 200
            });
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getAllOptions(req: Request, res: Response) {
        try {
            optionService.getAllOptions();

            return res.status(200).json({
                message: "Successfully fetched all options",
                data: optionService,
                status: 200
            });
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createOption(req: Request, res: Response) {
        try {
            const questionId = req.body.questionId;
            const option = req.body.option;

            optionService.createOption(questionId, option);

            return res.status(200).json({
                message: "Successfully created option",
                data: optionService,
                status: 200
            });
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async updateOption(req: Request, res: Response) {
        try {
            const questionId = req.body.questionId;
            const option = req.body.option;
            const newOption = req.body.newOption;
            optionService.updateOption(questionId, option, newOption);

            return res.status(200).json({
                message: "Successfully updated option",
                data: optionService,
                status: 200
            });
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async deleteOption(req: Request, res: Response) {
        try {
            const questionId = req.body.questionId;
            const option = req.body.option;

            optionService.deleteAllOptionsInQuestion(questionId);

            return res.status(200).json({
                message: "Successfully deleted option",
                data: optionService,
                status: 200
            });
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new optionController();