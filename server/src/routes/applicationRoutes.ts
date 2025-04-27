import express from "express";
import { middleware } from "../Middleware/middleware";
import {createApplication,listApplications,updateApplicationStatus} from "../controllers/applicationControllers";

const router = express.Router();

router.post("/", middleware(["tenant"]), createApplication);
router.put("/:id/status", middleware(["manager"]), updateApplicationStatus);
router.get("/", middleware(["manager", "tenant"]), listApplications);

export default router;