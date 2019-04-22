import { Request, Response, NextFunction } from "express";
import validator from "validator";

import { Job } from "./job.model";
import { queueJob } from "../../job-queue";

/**
 * get the job of the given id
 *
 * @param req
 * @param res
 */
export const getOne = async (req: Request, res: Response) => {
  try {
    const doc = await Job.findOne({ _id: req.params.id })
      .lean()
      .exec();

    if (!doc) {
      return res.status(400).end();
    }

    res.status(200).json({ data: doc });
  } catch (e) {
    res.status(400).end();
  }
};

/**
 * get all of the jobs
 *
 * @param _
 * @param res
 */
export const getMany = async (req: Request, res: Response) => {
  try {
    const docs = await Job.find()
      .lean()
      .exec();

    res.status(200).json({ data: docs });
  } catch (e) {
    res.status(400).end();
  }
};

/**
 * Create one new job
 *
 * @param req
 * @param res
 */
export const createOne = async (req: Request, res: Response) => {
  try {
    const doc = await Job.create(req.body);

    queueJob({
      _id: doc._id,
      url: req.body.url
    });

    res.status(201).json({ data: doc });
  } catch (e) {
    res.status(400).end();
  }
};

/**
 * validate the url is a url in the request body
 *
 * @param req
 * @param res
 * @param next
 */
export const urlValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url } = req.body;

  const isValid = validator.isURL(url);

  if (!isValid) {
    res.status(400).end();
  }

  next();
};
