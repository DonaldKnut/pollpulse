import { Router } from "express";
import {
  createRoom,
  getRoom,
  voteRoom,
  getResults,
} from "../controllers/roomController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { getRoomsByUser } from "../controllers/roomController";

const router = Router();

router.get("/", asyncHandler(getRoomsByUser));
router.post("/", asyncHandler(protect), asyncHandler(createRoom));
router.get("/:id", asyncHandler(getRoom));
router.post("/:id/vote", asyncHandler(voteRoom));
router.get("/:id/results", asyncHandler(protect), asyncHandler(getResults));

export default router;
