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
const certification_service_1 = __importDefault(require("./certification.service"));
class certificationController {
    getCertifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.getAllCertifications();
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getCertificationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.getCertificationById(Number(req.params.id));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getCertificationByCourseId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.getCertificationByCourseId(Number(req.params.courseId));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    getCertificationByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.getCertificationByStudentId(Number(req.params.studentId));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    createCertification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.createCertification(req.body);
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    updateCertification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.updateCertification(req.body);
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteCertification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.deleteCertification(Number(req.params.id));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteCertificationByCourseId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.deleteCertificationByCourseId(Number(req.params.courseId));
                return res.status(response.status).send(response);
            }
            catch (error) {
                return {
                    message: error,
                    status: 500
                };
            }
        });
    }
    deleteCertificationByStudentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield certification_service_1.default.deleteCertificationByStudentId(Number(req.params.studentId));
                return res.status(response.status).send(response);
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
exports.default = new certificationController();
