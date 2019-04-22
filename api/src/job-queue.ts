import axios, { AxiosError } from "axios";
import { Subject, from } from "rxjs";
import { switchMap } from "rxjs/operators";

import { Job, Status } from "./resources/job/job.model";

type JobProcess = {
  _id: string;
  url: string;
};

type JobResult = {
  _id: string;
  status: Status;
  result: string;
};

/**
 * Atempt to get the url provided by the job process
 * return the result with the new status
 *
 * this should be handled in a separate service.
 *
 * @param job
 */
async function getFromJob(job: JobProcess): Promise<JobResult> {
  try {
    const response = await axios.get(job.url);
    return {
      _id: job._id,
      status: Status.COMPLETE,
      result: JSON.stringify(response.data, null, 2)
    };
  } catch (err) {
    const { response = {} } = err;
    return {
      _id: job._id,
      status: Status.ERROR,
      result: JSON.stringify(
        {
          error: err.message,
          response: response.data
        },
        null,
        2
      )
    };
  }
}

/**
 * Update the given job with the updated status and result
 *
 * this should be in its own service to update jobs after processing
 *
 * @param jobResult
 */
async function updateJob(jobResult: JobResult): Promise<void> {
  try {
    const updatedDoc = await Job.findOneAndUpdate(
      { _id: jobResult._id },
      { status: jobResult.status, result: jobResult.result },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedDoc) {
      console.log("Error updating the document");
    }
  } catch (e) {
    console.log("Error updated the document");
  }
}

/**
 *
 * Add a url to a queue to be processed
 *
 * in the future this would put a message in
 * a message queue to be processed by another
 * service
 *
 * @param job - the job to process
 */
function queueJob(job: JobProcess) {
  jobSubject.next(job);
}

/**
 * simulate a queue by creating a Subject Stream
 *
 * processing the queue should be a separate service
 * whose sole purpose is processing messages from the
 * queue
 */
const jobSubject = new Subject<JobProcess>();

// when we recieve a new Job Process message, get the data from thr url
// then update the job data in the database
jobSubject.pipe(switchMap(job => from(getFromJob(job)))).subscribe(updateJob);

// as part of the module api, only expose the ability to
// queue a new job
export { queueJob };
