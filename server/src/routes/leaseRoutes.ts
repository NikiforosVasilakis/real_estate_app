import express from "express";
import { middleware } from "../Middleware/middleware";
import { getLeasePayments, getLeases } from "../controllers/leaseController";

const router = express.Router();

router.get("/", middleware(["manager", "tenant"]), getLeases);
router.get("/:id/payments",middleware(["manager", "tenant"]), getLeasePayments);

export default router;