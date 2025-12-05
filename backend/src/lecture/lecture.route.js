"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lecture_controller_1 = __importDefault(require("./lecture.controller"));
const router = (0, express_1.Router)();
router.get("/", lecture_controller_1.default.getAllLectures);
router.get("/name/:name", lecture_controller_1.default.getLectureByName);
router.get("/section/:sectionId", lecture_controller_1.default.getLectureBySectionId);
router.post("/create", lecture_controller_1.default.addLecture);
router.patch("/update", lecture_controller_1.default.updateLecture);
router.delete("/delete/:id", lecture_controller_1.default.deleteLecture);
exports.default = router;
