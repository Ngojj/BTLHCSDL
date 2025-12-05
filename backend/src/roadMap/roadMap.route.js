"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roadMap_controller_1 = __importDefault(require("./roadMap.controller"));
const router = (0, express_1.Router)();
router.get("/", roadMap_controller_1.default.getRoadMaps);
router.get("/id/:id", roadMap_controller_1.default.getRoadMapById);
router.post("/create", roadMap_controller_1.default.createRoadMap);
router.patch("/update", roadMap_controller_1.default.updateRoadMap);
router.delete("/delete/:id", roadMap_controller_1.default.deleteRoadMap);
exports.default = router;
