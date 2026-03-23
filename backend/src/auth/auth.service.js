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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.login = (user, password) => __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, user.password);
        });
        this.getAccessToken = (user) => __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.TOKEN_SECRET;
            if (!secret) {
                throw new Error("Missing TOKEN_SECRET");
            }
            const claims = {
                sub: user.id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };
            return jsonwebtoken_1.default.sign(claims, secret, { expiresIn: 60 * 60 });
        });
    }
}
exports.default = new AuthService();
