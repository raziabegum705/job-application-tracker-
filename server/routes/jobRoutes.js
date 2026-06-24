const express = require("express");
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob, getStats } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/stats", getStats);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
