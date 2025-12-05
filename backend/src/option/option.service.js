"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
class optionService {
    getAllOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllOptions = yield db_1.db.select({
                    questionId: schema_1.option.questionId,
                    option: schema_1.option.option
                })
                    .from(schema_1.option);
                return {
                    message: "Successfully fetched all options",
                    data: getAllOptions,
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getOptionByQuestionId(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getOptionByQuestionId = yield db_1.db.select({
                    questionId: schema_1.option.questionId,
                    option: schema_1.option.option
                })
                    .from(schema_1.option)
                    .where((0, drizzle_orm_1.eq)(schema_1.option.questionId, questionId));
                if (getOptionByQuestionId.length === 0) {
                    return {
                        message: "Option not found",
                        status: 404
                    };
                }
                return {
                    message: "Successfully fetched option",
                    data: getOptionByQuestionId,
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createOption(questionId, optionStr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createOption = yield db_1.db
                    .insert(schema_1.option)
                    .values({
                    questionId: questionId,
                    option: optionStr
                });
                if (createOption === null) {
                    return {
                        message: "Failed to create option",
                        status: 500
                    };
                }
                return {
                    message: "Successfully created option",
                    status: 201
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateOption(questionId, optionStr, newOptionStr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find first
                const findFirst = yield this.getOptionByQuestionId(questionId);
                if (findFirst.status != 200) {
                    return {
                        message: "Option not found",
                        status: 404
                    };
                }
                const updateOption = yield db_1.db
                    .update(schema_1.option)
                    .set({
                    option: newOptionStr
                })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.option.questionId, questionId), (0, drizzle_orm_1.eq)(schema_1.option.option, optionStr)))
                    .returning({
                    questionId: schema_1.option.questionId,
                    option: schema_1.option.option
                });
                return {
                    message: "Successfully updated option",
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteAllOptionsInQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find first
                const findFirst = yield this.getOptionByQuestionId(questionId);
                if (findFirst.status != 200) {
                    return {
                        message: "Option not found",
                        status: 404
                    };
                }
                const deleteOption = yield db_1.db
                    .delete(schema_1.option)
                    .where((0, drizzle_orm_1.eq)(schema_1.option.questionId, questionId));
                return {
                    message: "Successfully deleted all options in question",
                    status: 200
                };
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
}
exports.default = new optionService();
