import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import jobRouter from "./resources/job/job.router";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/job", jobRouter);

export const start = async () => {
  const {
    DEFAULT_CONNECTION_STRING: url = "mongodb://massdrop_challenge_mongo-db:27017/massdrop_challenge"
  } = process.env;

  try {
    await mongoose.connect(url);
    app.listen(port, () => {
      console.log(`REST API http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
};
