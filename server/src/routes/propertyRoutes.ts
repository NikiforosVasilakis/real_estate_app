import express  from "express";
import {createProperty, getProperty, getProperties} from "../controllers/propertyController"
import { middleware } from "../Middleware/middleware"
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", middleware(["manager"]), createProperty);


export default router;