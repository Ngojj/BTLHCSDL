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
const viewRoadMap_service_1 = __importDefault(require("./viewRoadMap.service"));
class viewRoadMapController {
    getAllRoadMap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const all = yield viewRoadMap_service_1.default.getAllRoadMap();
                return res.status(all.status).send(all);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRoadMapById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = yield viewRoadMap_service_1.default.getRoadMapById(Number(req.params.rmId));
                return res.status(roadMap.status).send(roadMap);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRoadMapByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = yield viewRoadMap_service_1.default.getRoadMapByStudentId(Number(req.params.studentId));
                return res.status(roadMap.status).send(roadMap);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRoadMapByStudentIdAndRmId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = yield viewRoadMap_service_1.default.getRoadMapByStudentIdAndRoadMapId(Number(req.params.studentId), Number(req.params.rmId));
                return res.status(roadMap.status).send(roadMap);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createRoadMap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = req.body;
                const newRoadMap = yield viewRoadMap_service_1.default.createRoadMap(roadMap);
                return res.status(newRoadMap.status).send(newRoadMap);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateRoadMap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roadMap = req.body;
                const updatedRoadMap = yield viewRoadMap_service_1.default.updateRoadMap(roadMap);
                return res.status(updatedRoadMap.status).send(updatedRoadMap);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteRoadMap(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedRoadMap = yield viewRoadMap_service_1.default.deleteRoadMap(Number(req.params.rmId), Number(req.params.studentId));
                return res.status(deletedRoadMap.status).send(deletedRoadMap);
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
exports.default = new viewRoadMapController();
