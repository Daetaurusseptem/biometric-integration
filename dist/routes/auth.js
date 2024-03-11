"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../controllers/Auth");
const jwt_1 = require("../middleware/jwt");
const router = express_1.default.Router();
router.post('/', Auth_1.login);
router.get('/renew', jwt_1.verifyToken, Auth_1.renewToken);
exports.default = router;
