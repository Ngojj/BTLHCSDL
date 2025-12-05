"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certification_controller_1 = __importDefault(require("./certification.controller"));
const router = (0, express_1.Router)();
router.get('/', certification_controller_1.default.getCertifications);
router.get('/id/:id', certification_controller_1.default.getCertificationById);
router.get('/courseId/:courseId', certification_controller_1.default.getCertificationByCourseId);
router.get('/studentId/:studentId', certification_controller_1.default.getCertificationByStudentId);
router.post('/create', certification_controller_1.default.createCertification);
router.patch('/update', certification_controller_1.default.updateCertification);
router.delete('/delete/:id', certification_controller_1.default.deleteCertification);
router.delete('/delete/courseId/:courseId', certification_controller_1.default.deleteCertificationByCourseId);
router.delete('/delete/studentId/:studentId', certification_controller_1.default.deleteCertificationByStudentId);
exports.default = router;
