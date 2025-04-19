import express  from "express";
import {createTenant, getCurrentResidencies, getFavoriteProperty, getTenant, updateTenant,RemoveFavoriteProperty} from "../controllers/tenantController"

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant)
router.post("/",createTenant);
router.get("/:cognitoId/current-resedences",getCurrentResidencies);
router.post("/:cognitoId/favorites/:properyId", getFavoriteProperty);
router.delete("/:cognitoId/favorites/:properyId", RemoveFavoriteProperty);


export default router;