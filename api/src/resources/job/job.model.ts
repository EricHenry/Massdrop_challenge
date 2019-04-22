import mongoose from "mongoose";

export enum Status {
  COMPLETE = "COMPLETE",
  IN_PROGRESS = "IN_PROGRESS",
  ERROR = "ERROR"
}

const jobSchema = new mongoose.Schema({
  result: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: [Status.COMPLETE, Status.IN_PROGRESS, Status.ERROR],
    default: Status.IN_PROGRESS
  },
  url: {
    type: String,
    required: true
  }
});

export const Job = mongoose.model("job", jobSchema);
