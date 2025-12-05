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
const interact_service_1 = __importDefault(require("./interact.service"));
class interactController {
    getAllInteractions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield interact_service_1.default.getAllInteractions();
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getInteractionsByLectureId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield interact_service_1.default.getInteractionsByLectureId(Number(req.params.lectureId));
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getInteractionsByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield interact_service_1.default.getInteractionsByStudentId(Number(req.params.studentId));
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getInteractionsByLectureIdAndStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield interact_service_1.default.getInteractionsByLectureIdAndStudentId(Number(req.params.lectureId), Number(req.params.studentId));
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createInteraction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield interact_service_1.default.createInteraction(req.body.lectureId, req.body.studentId);
                return res.status(All.status).send(All);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteInteraction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield interact_service_1.default.deleteInteraction(Number(req.params.lectureId), Number(req.params.studentId));
                return res.status(All.status).send(All);
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
exports.default = new interactController();
