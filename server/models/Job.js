const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: [true, "Company name is required"], trim: true },
    role: { type: String, required: [true, "Role/Position is required"], trim: true },
    location: { type: String, default: "Remote", trim: true },
    status: { type: String, enum: ["Applied", "OA", "Interview", "Offer", "Rejected"], default: "Applied" },
    jobUrl: { type: String, trim: true },
    salary: { type: String, trim: true },
    appliedDate: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    notes: { type: String, trim: true },
    source: { type: String, enum: ["LinkedIn", "Naukri", "Company Website", "Referral", "Other"], default: "LinkedIn" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
