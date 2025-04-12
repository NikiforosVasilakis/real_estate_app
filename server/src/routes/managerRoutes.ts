import Express  from "express";
import { getManager, createManager,UpdateManager } from "../controllers/managerControllers"

const router = Express.Router();

router.get("/:cognitoID", getManager);
router.put("/:cognitoID", UpdateManager);
router.post("/", createManager);

export default router;
