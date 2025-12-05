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
const section_service_1 = __importDefault(require("./section.service"));
class sectionController {
    constructor() {
        this.getAllSections = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield section_service_1.default.getSections();
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.getSectionById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield section_service_1.default.getSectionById(Number(req.params.id));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.getSectionsInCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield section_service_1.default.getSectionsInCourse(Number(req.params.courseId));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.createSection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.body.name;
                const numOfLecture = req.body.numOfLecture;
                const timeToComplete = req.body.timeToComplete;
                const teacherId = req.body.teacherId;
                const courseId = req.body.courseId;
                const response = yield section_service_1.default.createSection(name, numOfLecture, timeToComplete, teacherId, courseId);
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.updateSection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.body.id;
                const name = req.body.name;
                const numOfLecture = req.body.numOfLecture;
                const timeToComplete = req.body.timeToComplete;
                const teacherId = req.body.teacherId;
                const courseId = req.body.courseId;
                const response = yield section_service_1.default.updateSection(id, name, numOfLecture, timeToComplete, teacherId, courseId);
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.deleteSection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield section_service_1.default.deleteSection(Number(id));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
        this.deleteSectionsInCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.courseId;
                const response = yield section_service_1.default.deleteSectionsInCourse(Number(id));
                return res.status(response.status).send(response);
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
exports.default = new sectionController();
