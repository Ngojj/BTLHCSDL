"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const viewRoadMap_controller_1 = __importDefault(require("./viewRoadMap.controller"));
const router = (0, express_1.Router)();
router.get("/", viewRoadMap_controller_1.default.getAllRoadMap);
router.get("/rmId/:rmId", viewRoadMap_controller_1.default.getRoadMapById);
router.get("/studentId/:studentId", viewRoadMap_controller_1.default.getRoadMapByStudentId);
router.get("/studentId/:studentId/rmId/:rmId", viewRoadMap_controller_1.default.getRoadMapByStudentIdAndRmId);
router.post("/create", viewRoadMap_controller_1.default.createRoadMap);
router.patch("/update", viewRoadMap_controller_1.default.updateRoadMap);
router.delete("/delete/studentId/:studentId/rmId/:rmId", viewRoadMap_controller_1.default.deleteRoadMap);
exports.default = router;
