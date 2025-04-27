"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const middleware_1 = require("../Middleware/middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.get("/", propertyController_1.getProperties);
router.get("/:id", propertyController_1.getProperty);
router.post("/", (0, middleware_1.middleware)(["manager"]), propertyController_1.createProperty);
exports.default = router;
