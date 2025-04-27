"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../Middleware/middleware");
const leaseController_1 = require("../controllers/leaseController");
const router = express_1.default.Router();
router.get("/", (0, middleware_1.middleware)(["manager", "tenant"]), leaseController_1.getLeases);
router.get("/:id/payments", (0, middleware_1.middleware)(["manager", "tenant"]), leaseController_1.getLeasePayments);
exports.default = router;
