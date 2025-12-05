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
const courseTopic_service_1 = __importDefault(require("./courseTopic.service"));
class courseTopicController {
    constructor() {
        this.getAllCourseTopic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const allCourseTopic = yield courseTopic_service_1.default.getAllCourseTopic();
                return res.status(200).json({
                    message: 'Successfully',
                    data: allCourseTopic
                });
            }
            catch (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error: ' + err,
                });
            }
        });
        this.getCourseTopicById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                const courseTopicByCourseId = yield courseTopic_service_1.default.getCourseTopicById(Number(courseId));
                return res.status(200).json({
                    message: 'Successfully',
                    data: courseTopicByCourseId
                });
            }
            catch (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error: ' + err,
                });
            }
        });
        this.createCourseTopic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.body.courseId;
                const topic = req.body.topic;
                const newCourseTopic = yield courseTopic_service_1.default.createCourseTopic(courseId, topic);
                return res.status(newCourseTopic.status).send(newCourseTopic);
            }
            catch (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error: ' + err,
                });
            }
        });
        this.updateCourseTopic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.body.courseId;
                const topic = req.body.topic;
                const newCourseTopic = yield courseTopic_service_1.default.updateCourseTopic(courseId, topic);
                return res.status(newCourseTopic.status).send(newCourseTopic);
            }
            catch (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error: ' + err,
                });
            }
        });
        this.deleteCourseTopic = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                const newCourseTopic = yield courseTopic_service_1.default.deleteCourseTopic(Number(courseId));
                if (newCourseTopic.status !== 200) {
                    return res.status(newCourseTopic.status).json({
                        message: newCourseTopic.message,
                        status: newCourseTopic.status,
                    });
                }
                return res.status(200).json({
                    message: newCourseTopic.message,
                    status: 200
                });
            }
            catch (err) {
                return res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error: ' + err,
                });
            }
        });
    }
}
exports.default = new courseTopicController();
