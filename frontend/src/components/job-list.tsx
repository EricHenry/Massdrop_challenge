import axios from "axios";
import React, { FC } from "react";

import { Actions, Job, JobChecks, Status } from "../redux";

type Props = {
  jobs: Job[];
  checkingJobs: JobChecks;
  checkJobStart: typeof Actions.checkJobStart;
  checkJobComplete: typeof Actions.checkJobComplete;
};

export const JobList: FC<Props> = props => {
  const checkJobStatus = async (id: string) => {
    props.checkJobStart();
    try {
      const response = await axios.get(`http://localhost:3001/api/job/${id}`);
      props.checkJobComplete(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container">
      {props.jobs.map((j: Job) => {
        const statusColor = statusToColor[j.status];
        const statusText = statusToText[j.status];
        return (
          <div key={j._id} className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="text-primary">{j.url}</span>
              <span className={statusColor}>Status: {statusText}</span>
              {!j.result && (
                <button
                  className="btn btn-primary float-right"
                  onClick={() => checkJobStatus(j._id)}
                >
                  {props.checkingJobs[j._id] ? (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Check result"
                  )}
                </button>
              )}
            </div>
            <div className="collapse show">
              <div className="card-body result-body">{j.result}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
JobList.displayName = "JobsList";

const statusToText = {
  [Status.IN_PROGRESS]: "In Progress",
  [Status.COMPLETE]: "Completed",
  [Status.ERROR]: "Errored"
};

const statusToColor = {
  [Status.IN_PROGRESS]: "text-warning",
  [Status.COMPLETE]: "text-success",
  [Status.ERROR]: "text-danger"
};
