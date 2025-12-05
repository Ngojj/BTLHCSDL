"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dO_controller_1 = __importDefault(require("./dO.controller"));
const router = (0, express_1.Router)();
router.get(`/quiz/:quizId/student/:studentId`, dO_controller_1.default.getDOByQuizIdAndStudentId);
router.get(`/quiz/:quizId/student/:studentId/attemptOrder/:attemptOrder`, dO_controller_1.default.getDOByQuizIdAndStudentIdAndAttemptOrder);
router.post(`/create`, dO_controller_1.default.createDO);
exports.default = router;
