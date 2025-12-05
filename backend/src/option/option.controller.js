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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const option_service_1 = __importDefault(require("./option.service"));
class optionController {
    getOptionByQuestionId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.params.questionId;
                const questions = yield option_service_1.default.getOptionByQuestionId(Number(questionId));
                return res.status(200).json({
                    message: "Successfully fetched option",
                    data: questions,
                    status: 200
                });
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getAllOptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                option_service_1.default.getAllOptions();
                return res.status(200).json({
                    message: "Successfully fetched all options",
                    data: option_service_1.default,
                    status: 200
                });
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createOption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.body.questionId;
                const option = req.body.option;
                option_service_1.default.createOption(questionId, option);
                return res.status(200).json({
                    message: "Successfully created option",
                    data: option_service_1.default,
                    status: 200
                });
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateOption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.body.questionId;
                const option = req.body.option;
                const newOption = req.body.newOption;
                option_service_1.default.updateOption(questionId, option, newOption);
                return res.status(200).json({
                    message: "Successfully updated option",
                    data: option_service_1.default,
                    status: 200
                });
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteOption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.body.questionId;
                const option = req.body.option;
                option_service_1.default.deleteAllOptionsInQuestion(questionId);
                return res.status(200).json({
                    message: "Successfully deleted option",
                    data: option_service_1.default,
                    status: 200
                });
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
exports.default = new optionController();
