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
const quiz_service_1 = __importDefault(require("./quiz.service"));
class quizController {
    getAllQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizzes = yield quiz_service_1.default.getAllQuiz();
                return res.status(quizzes.status).send(quizzes.data);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuizById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizById = yield quiz_service_1.default.getQuizById(Number(req.params.id));
                return res.status(quizById.status).send(quizById.data);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuizByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizByName = yield quiz_service_1.default.getQuizByName(req.params.name);
                return res.status(quizByName.status).send(quizByName.data || quizByName.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    getQuizBySectionId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizBySectionId = yield quiz_service_1.default.getQuizBySection(Number(req.params.sectionId));
                return res.status(quizBySectionId.status).send(quizBySectionId.data || quizBySectionId.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    createQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.body.name;
                const state = req.body.state;
                const attempt = req.body.attempt;
                const duration = req.body.duration;
                const teacherId = req.body.teacherId;
                const sectionId = req.body.sectionId;
                const quiz = yield quiz_service_1.default.createQuiz(name, state, attempt, duration, teacherId, sectionId);
                return res.status(quiz.status).send(quiz.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    updateQuiz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.body.id;
                const name = req.body.name;
                const state = req.body.state;
                const attempt = req.body.attempt;
                const duration = req.body.duration;
                const teacherId = req.body.teacherId;
                const sectionId = req.body.sectionId;
                const quiz = yield quiz_service_1.default.updateQuiz(id, name, state, attempt, duration, teacherId, sectionId);
                return res.status(quiz.status).send(quiz.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    deleteQuizById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quiz = yield quiz_service_1.default.deleteQuizById(Number(req.params.id));
                return res.status(quiz.status).send(quiz.message);
            }
            catch (error) {
                return {
                    status: 500,
                    message: error
                };
            }
        });
    }
    deleteQuizByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quiz = yield quiz_service_1.default.deleteQuizByName(req.params.name);
                return res.status(quiz.status).send(quiz.message);
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
exports.default = new quizController();
