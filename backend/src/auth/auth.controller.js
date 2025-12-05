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
const user_service_1 = __importDefault(require("../user/user.service"));
const auth_service_1 = __importDefault(require("./auth.service"));
class AuthController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield user_service_1.default.getUserByUsername(username);
                if (!user) {
                    return res.status(401).json({
                        message: "Invalid username"
                    });
                }
                const isPass = yield auth_service_1.default.login(user, password);
                if (!isPass) {
                    return res.status(401).json({
                        message: "Invalid password"
                    });
                }
                const token = yield auth_service_1.default.getAccessToken(user);
                return res.status(200).json({
                    message: "Login successfully!",
                    token: token
                });
            }
            catch (e) {
                return res.status(500).json({
                    message: e
                });
            }
        });
    }
}
exports.default = new AuthController();
