import Express  from "express";
import { getManager, createManager, updateManager, getManagerProperties } from "../controllers/managerControllers"

const router = Express.Router();

router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.get("/cognitoId/properties", getManagerProperties);
router.post("/", createManager);

export default router;
