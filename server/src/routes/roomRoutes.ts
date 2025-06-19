import { Router } from "express";
import {
  createRoom,
  getRoom,
  voteRoom,
  getResults,
} from "../controllers/roomController";
import { protect } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/", asyncHandler(protect), asyncHandler(createRoom));
router.get("/:id", asyncHandler(getRoom));
router.post("/:id/vote", asyncHandler(voteRoom));
router.get("/:id/results", asyncHandler(protect), asyncHandler(getResults));

export default router;
