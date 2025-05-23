"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tenantController_1 = require("../controllers/tenantController");
const router = express_1.default.Router();
router.get("/:cognitoId", tenantController_1.getTenant);
router.put("/:cognitoId", tenantController_1.updateTenant);
router.post("/", tenantController_1.createTenant);
router.get("/:cognitoId/current-resedences", tenantController_1.getCurrentResidencies);
router.post("/:cognitoId/favorites/:properyId", tenantController_1.getFavoriteProperty);
router.delete("/:cognitoId/favorites/:properyId", tenantController_1.RemoveFavoriteProperty);
exports.default = router;
