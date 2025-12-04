import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { option } from "../db/schema";
import questionService from "../question/question.service";

class optionService {
    public async getAllOptions() {
        try {
            const getAllOptions = await db.select({
                questionId: option.questionId,
                option: option.option
            })
            .from(option)

            return {
                message: "Successfully fetched all options",
                data: getAllOptions,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async getOptionByQuestionId(questionId: number) {
        try {
            const getOptionByQuestionId = await db.select({
                questionId: option.questionId,
                option: option.option
            })
            .from(option)
            .where(eq(option.questionId, questionId))

            if (getOptionByQuestionId.length === 0) {
                return {
                    message: "Option not found",
                    status: 404
                }
            }

            return {
                message: "Successfully fetched option",
                data: getOptionByQuestionId,
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }

    public async createOption(questionId: number, optionStr: string) {
        try {

            const createOption = await db
            .insert(option)
            .values({
                questionId: questionId,
                option: optionStr
            })
            if (createOption === null){
                return {
                    message: "Failed to create option",
                    status: 500
                }
            }
            return {
                message: "Successfully created option",
                status: 201
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }   

    public async updateOption(questionId: number, optionStr: string, newOptionStr: string) {
        try {
            // find first
            const findFirst = await this.getOptionByQuestionId(questionId)
            if (findFirst.status != 200){
                return {
                    message: "Option not found",
                    status: 404
                }
            }
            const updateOption = await db
            .update(option)
            .set({
                option: newOptionStr
            })
            .where(and(eq(option.questionId, questionId) , eq(option.option, optionStr)))
            .returning({
                questionId: option.questionId,
                option: option.option
            })

            return {
                message: "Successfully updated option",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }


    public async deleteAllOptionsInQuestion(questionId: number) {
        try {
            // find first
            const findFirst = await this.getOptionByQuestionId(questionId)
            if (findFirst.status != 200){
                return {
                    message: "Option not found",
                    status: 404
                }
            }
            const deleteOption = await db
            .delete(option)
            .where(eq(option.questionId, questionId))

            return {
                message: "Successfully deleted all options in question",
                status: 200
            }
        } catch (error) {
            return {
                message: error,
                status: 500
            }
        }
    }
}

export default new optionService();
