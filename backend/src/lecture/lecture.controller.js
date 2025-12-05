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
const lecture_service_1 = __importDefault(require("./lecture.service"));
class lectureController {
    getAllLectures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const All = yield lecture_service_1.default.getAllLectures();
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
    getLectureByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.params.name;
                const lecture = yield lecture_service_1.default.getLectureByName(name);
                return res.status(lecture.status).send(lecture);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getLectureBySectionId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sectionId = req.params.sectionId;
                const lecture = yield lecture_service_1.default.getLectureBySectionId(Number(sectionId));
                return res.status(lecture.status).send(lecture);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    addLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lecture = req.body;
                const newLecture = yield lecture_service_1.default.createLecture(lecture);
                return res.status(newLecture.status).send(newLecture);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lecture = req.body;
                const updateLecture = yield lecture_service_1.default.updateLecture(lecture);
                return res.status(updateLecture.status).send(updateLecture);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const deleteLecture = yield lecture_service_1.default.deleteLecture(Number(id));
                return res.status(deleteLecture.status).send(deleteLecture);
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
exports.default = new lectureController();
