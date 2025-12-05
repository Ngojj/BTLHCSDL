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
const dO_service_1 = __importDefault(require("./dO.service"));
class dOController {
    getAllDO(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dOData = yield dO_service_1.default.getAllDO();
                return res.status(dOData.status).send(dOData);
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    getDOByQuizIdAndStudentIdAndAttemptOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizId = req.params.quizId;
                const studentId = req.params.studentId;
                const attemptOrder = req.params.attemptOrder;
                const dOData = yield dO_service_1.default.getDOByQuizIdAndStudentIdAndAttemptOrder(Number(quizId), Number(studentId), Number(attemptOrder));
                return res.status(dOData.status).send(dOData);
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    getDOByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.params.studentId;
                const dOData = yield dO_service_1.default.getDOByStudentId(Number(studentId));
                return res.status(dOData.status).send(dOData);
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    getDOByQuizIdAndStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizId = req.params.quizId;
                const studentId = req.params.studentId;
                const dOData = yield dO_service_1.default.getDOByQuizIdAndStudentId(Number(quizId), Number(studentId));
                return res.status(dOData.status).send(dOData);
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    createDO(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const dOData = yield dO_service_1.default.createDO(data);
                return res.status(dOData.status).send(dOData);
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    updateDO(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const dOData = yield dO_service_1.default.updateDO(data);
                return res.status(dOData.status).send(dOData);
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
    deleteDO(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizId = req.params.quizId;
                const studentId = req.params.studentId;
                const dOData = yield dO_service_1.default.deleteDO(Number(quizId), Number(studentId));
                return res.status(dOData.status).send(dOData);
            }
            catch (error) {
                return {
                    error: error,
                    status: 500
                };
            }
        });
    }
}
exports.default = new dOController();
