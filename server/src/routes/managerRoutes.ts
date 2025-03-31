import Express  from "express";
import {getManager, createManager} from "../controllers/managerControllers"

const router = Express.Router();

router.get("/:cognitoID", getManager)
router.post("/", createManager);

export default router;
