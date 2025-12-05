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
const roadMap_service_1 = __importDefault(require("./roadMap.service"));
class roadMapController {
    getRoadMaps(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all roadmaps
            try {
                const roadMaps = yield roadMap_service_1.default.getAllRoadMaps();
                return res.status(roadMaps.status).send(roadMaps);
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
            // Get roadmap by id
            try {
                const id = req.params.id;
                const roadMapById = yield roadMap_service_1.default.getRoadMapById(Number(id));
                return res.status(roadMapById.status).send(roadMapById);
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
            // Create a new roadmap
            try {
                const roadMap = req.body;
                const includeCourse = req.body.includeCourse;
                const newRoadMap = yield roadMap_service_1.default.createRoadMap(roadMap, includeCourse);
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
            // Update roadmap
            try {
                const roadMap = req.body;
                const updatedRoadMap = yield roadMap_service_1.default.updateRoadMap(roadMap);
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
            // Delete roadmap
            try {
                const id = req.params.id;
                const deletedRoadMap = yield roadMap_service_1.default.deleteRoadMap(Number(id));
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
exports.default = new roadMapController();
