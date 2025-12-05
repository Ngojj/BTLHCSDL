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
const answerRecord_service_1 = __importDefault(require("./answerRecord.service"));
class answerRecordController {
    getRecordByquestionIdAndStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield answerRecord_service_1.default.getRecordByQuestionIdAndStudentId(Number(req.params.questionId), Number(req.params.studentId));
                return res.status(record.status).send(record);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRecordByQuizIdAndStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield answerRecord_service_1.default.getRecordByQuizIdAndStudentId(Number(req.params.quizId), Number(req.params.studentId));
                return res.status(record.status).send(record);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield answerRecord_service_1.default.createRecord(req.body);
                return res.status(record.status).send(record);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield answerRecord_service_1.default.updateRecord(req.body);
                return res.status(record.status).send(record);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const record = yield answerRecord_service_1.default.deleteRecord(req.body.quizId, req.body.studentId, req.body.questionId);
                return res.status(record.status).send(record);
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
exports.default = new answerRecordController();
