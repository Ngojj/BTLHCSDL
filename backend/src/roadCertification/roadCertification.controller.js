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
const roadCertification_service_1 = __importDefault(require("./roadCertification.service"));
class roadCertificationController {
    getALLRoadCertification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield roadCertification_service_1.default.getALLRoadCertification();
                return res.status(result.status).json(result.message);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getRoadCertificationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield roadCertification_service_1.default.getRoadCertificationById(Number(req.params.id));
                return res.status(result.status).json(result.message);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createRoadCertification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield roadCertification_service_1.default.createRoadCertification(req.body);
                return res.status(result.status).json(result.message);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateRoadCertification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield roadCertification_service_1.default.updateRoadCertification(req.body);
                return res.status(result.status).json(result.message);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteRoadCertification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield roadCertification_service_1.default.deleteRoadCertification(Number(req.params.id));
                return res.status(result.status).json(result.message);
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
exports.default = new roadCertificationController();
