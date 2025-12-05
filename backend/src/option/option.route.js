"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const option_controller_1 = __importDefault(require("./option.controller"));
const router = (0, express_1.Router)();
// get all options
router.get('/', option_controller_1.default.getAllOptions);
// get option by question id
router.get('/id/:questionId', option_controller_1.default.getOptionByQuestionId);
// create option
router.post('/create', option_controller_1.default.createOption);
// update option
router.patch('/update', option_controller_1.default.updateOption);
// delete option
router.delete('/delete', option_controller_1.default.deleteOption);
exports.default = router;
