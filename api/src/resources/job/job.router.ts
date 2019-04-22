import express from "express";

import { createOne, getMany, getOne, urlValidator } from "./job.controller";

const job = express.Router();

job
  .route("/")
  .post(urlValidator, createOne)
  .get(getMany);

job.route("/:id").get(getOne);

export default job;
