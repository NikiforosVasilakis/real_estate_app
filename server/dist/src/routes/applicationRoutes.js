"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../Middleware/middleware");
const applicationControllers_1 = require("../controllers/applicationControllers");
const router = express_1.default.Router();
router.post("/", (0, middleware_1.middleware)(["tenant"]), applicationControllers_1.createApplication);
router.put("/:id/status", (0, middleware_1.middleware)(["manager"]), applicationControllers_1.updateApplicationStatus);
router.get("/", (0, middleware_1.middleware)(["manager", "tenant"]), applicationControllers_1.listApplications);
exports.default = router;
