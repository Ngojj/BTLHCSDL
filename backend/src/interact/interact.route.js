"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interact_controller_1 = __importDefault(require("./interact.controller"));
const router = (0, express_1.Router)();
router.get("/", interact_controller_1.default.getAllInteractions);
router.get("/lecture/:lectureId", interact_controller_1.default.getInteractionsByLectureId);
router.get("/student/:studentId", interact_controller_1.default.getInteractionsByStudentId);
router.get("/lecture/:lectureId/student/:studentId", interact_controller_1.default.getInteractionsByLectureIdAndStudentId);
router.post("/create", interact_controller_1.default.createInteraction);
router.delete("/delete", interact_controller_1.default.deleteInteraction);
exports.default = router;
