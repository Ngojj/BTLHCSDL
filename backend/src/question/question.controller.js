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
const question_service_1 = __importDefault(require("./question.service"));
class questionController {
    getAllQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield question_service_1.default.getAllQuestions();
                return res.status(questions.status).send(questions.data || questions.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuestionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionById = yield question_service_1.default.getQuestionById(Number(req.params.id));
                return res.status(questionById.status).send(questionById.data || questionById.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuestionByQuizId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionByQuizId = yield question_service_1.default.getQuestionByQuizId(Number(req.params.quizId));
                return res.status(questionByQuizId.status).send(questionByQuizId.data || questionByQuizId.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuestionAndAnswerByQuizId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionByQuizId = yield question_service_1.default.getQuestionAndOptionsByQuizId(Number(req.params.quizId));
                return res.status(questionByQuizId.status).send(questionByQuizId.data || questionByQuizId.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    createQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizId = req.body.quizId;
                const type = req.body.type;
                const answer = req.body.answer;
                const content = req.body.content;
                const teacherId = req.body.teacherId;
                const options = req.body.options;
                const question = yield question_service_1.default.createQuestion(quizId, type, answer, content, teacherId, options);
                return res.status(question.status).send(question.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    updateQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.body.id;
                const quizId = req.body.quizId;
                const type = req.body.type;
                const answer = req.body.answer;
                const content = req.body.content;
                const teacherId = req.body.teacherId;
                const question = yield question_service_1.default.updateQuestion(id, quizId, type, answer, content, teacherId);
                return res.status(question.status).send(question.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    deleteQuestionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const question = yield question_service_1.default.deleteQuestionById(Number(req.params.id));
                return res.status(question.status).send(question.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    deleteAllQuestionsInQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const question = yield question_service_1.default.deleteAllQuestionsInQuiz(Number(req.params.quizId));
                return res.status(question.status).send(question.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
}
exports.default = new questionController();
