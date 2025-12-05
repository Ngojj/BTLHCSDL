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
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const quiz_service_1 = __importDefault(require("../quiz/quiz.service"));
class sectionService {
    constructor() {
        this.deleteSection = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sectionExists = yield db_1.db.select({
                    id: schema_1.section.id
                })
                    .from(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.id, id));
                if (sectionExists.length === 0) {
                    return {
                        message: "Section not found",
                        status: 404
                    };
                }
                // delete all quizzes in this section first
                quiz_service_1.default.deleteAllQuizInSection(id);
                const deletedSection = yield db_1.db.delete(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.id, id));
                return {
                    message: "Section deleted successfully",
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
    getSectionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sectionById = yield db_1.db.select({
                    id: schema_1.section.id,
                    name: schema_1.section.name,
                    numOfLecture: schema_1.section.numOfLecture,
                    timeToComplete: schema_1.section.timeToComplete,
                    teacherId: schema_1.section.teacherId,
                    courseId: schema_1.section.courseId,
                    creTime: schema_1.section.creTime
                })
                    .from(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.id, id));
                if (sectionById.length === 0) {
                    return {
                        message: "Section not found",
                        status: 404
                    };
                }
                return {
                    message: "Section fetched successfully",
                    data: sectionById,
                    status: 200
                };
            }
            catch (error) {
                console.log(error);
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getSections() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sections = yield db_1.db.select({
                    id: schema_1.section.id,
                    name: schema_1.section.name,
                    numOfLecture: schema_1.section.numOfLecture,
                    timeToComplete: schema_1.section.timeToComplete,
                    teacherId: schema_1.section.teacherId,
                    courseId: schema_1.section.courseId,
                    creTime: schema_1.section.creTime
                })
                    .from(schema_1.section);
                return {
                    message: "Sections fetched successfully",
                    data: sections,
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
    getSectionsInCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sections = yield db_1.db.select({
                    id: schema_1.section.id,
                    name: schema_1.section.name,
                    numOfLecture: schema_1.section.numOfLecture,
                    timeToComplete: schema_1.section.timeToComplete,
                    teacherId: schema_1.section.teacherId,
                    courseId: schema_1.section.courseId,
                    creTime: schema_1.section.creTime
                })
                    .from(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.courseId, courseId))
                    .orderBy((0, drizzle_orm_1.asc)(schema_1.section.id));
                return {
                    message: "Sections fetched successfully1",
                    data: sections,
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
    createSection(name, numOfLecture, timeToComplete, teacherId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({
                    name: name,
                    numOfLecture: numOfLecture,
                    timeToComplete: timeToComplete,
                    teacherId: teacherId,
                    courseId: courseId
                });
                const newSection = yield db_1.db.insert(schema_1.section)
                    .values({
                    name: name,
                    numOfLecture: numOfLecture,
                    timeToComplete: timeToComplete,
                    teacherId: teacherId,
                    courseId: courseId
                });
                return {
                    message: "Section created successfully",
                    status: 200
                };
            }
            catch (error) {
                console.log(error);
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateSection(id, name, numOfLecture, timeToComplete, teacherId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sectionExists = yield db_1.db.select({
                    id: schema_1.section.id,
                    numOfLecture: schema_1.section.numOfLecture,
                    timeToComplete: schema_1.section.timeToComplete,
                    teacherId: schema_1.section.teacherId,
                    courseId: schema_1.section.courseId,
                })
                    .from(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.id, id));
                if (sectionExists.length === 0) {
                    return {
                        message: "Section not found",
                        status: 404
                    };
                }
                const updatedSection = yield db_1.db.update(schema_1.section)
                    .set({
                    name: name,
                    numOfLecture: numOfLecture,
                    timeToComplete: timeToComplete,
                    teacherId: teacherId,
                    courseId: courseId
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.section.id, id));
                if (updatedSection === null) {
                    return {
                        message: "Section not found",
                        status: 404
                    };
                }
                return {
                    message: "Section updated successfully",
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
    deleteSectionsInCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sections = yield db_1.db.select({
                    id: schema_1.section.id
                })
                    .from(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.courseId, courseId));
                if (sections.length === 0) {
                    return {
                        message: "No sections found",
                        status: 404
                    };
                }
                // delete all quizzes in these sections first
                sections.forEach((section) => __awaiter(this, void 0, void 0, function* () {
                    yield quiz_service_1.default.deleteAllQuizInSection(section.id);
                }));
                const deletedSections = yield db_1.db.delete(schema_1.section)
                    .where((0, drizzle_orm_1.eq)(schema_1.section.courseId, courseId));
                return {
                    message: "Sections deleted successfully",
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
exports.default = new sectionService();
