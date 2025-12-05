"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roadCertification_controller_1 = __importDefault(require("./roadCertification.controller"));
const router = (0, express_1.Router)();
router.get('/', roadCertification_controller_1.default.getALLRoadCertification);
router.get('/id/:id', roadCertification_controller_1.default.getRoadCertificationById);
router.post('/create', roadCertification_controller_1.default.createRoadCertification);
router.patch('/update', roadCertification_controller_1.default.updateRoadCertification);
router.delete('/delete/:id', roadCertification_controller_1.default.deleteRoadCertification);
exports.default = router;
