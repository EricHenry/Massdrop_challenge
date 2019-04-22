import { createAction, createReducer } from "redux-act";

export enum Status {
  COMPLETE = "COMPLETE",
  IN_PROGRESS = "IN_PROGRESS",
  ERROR = "ERROR"
}

export type Job = {
  _id: string;
  status: Status;
  url: string;
  result?: string;
};

export type JobChecks = { [id: string]: boolean };

export type State = {
  loadingJobs: boolean;
  jobs: Job[];
  loadingForm: boolean;
  url: string;
  checkingJobs: JobChecks;
};

const INITIAL_STATE: State = {
  loadingJobs: false,
  jobs: [],
  loadingForm: false,
  url: "",
  checkingJobs: {}
};

export const Actions = {
  loadingJobsStart: createAction("Loading jobs in progress"),
  loadingJobsComplete: createAction<Job[]>("Loading jobs complete"),
  updateUrl: createAction<string>("Change the form's url value"),
  createJobStart: createAction("Create new job in progrss"),
  createJobComplete: createAction<Job>("Create new job complete"),
  checkJobStart: createAction("Check job in progress"),
  checkJobComplete: createAction<Job>("Check job complete")
};

export const reducer = createReducer(
  {
    [Actions.loadingJobsStart.getType()]: state => ({
      ...state,
      loadingJobs: true,
      errorJobs: undefined
    }),
    [Actions.loadingJobsComplete.getType()]: (state, action) => ({
      ...state,
      jobs: action
    }),
    [Actions.updateUrl.getType()]: (state, action) => ({
      ...state,
      url: action
    }),
    [Actions.createJobStart.getType()]: state => ({
      ...state,
      loadingForm: true,
      errorForm: undefined
    }),
    [Actions.createJobComplete.getType()]: (state, action) => ({
      ...state,
      jobs: [action, ...state.jobs]
    }),
    [Actions.checkJobStart.getType()]: (state, action) => ({
      ...state,
      [action]: true
    }),
    [Actions.checkJobComplete.getType()]: (state, action) => {
      const oldJob = state.jobs.findIndex(j => j._id === action._id);

      const jobs = [
        ...state.jobs.slice(0, oldJob),
        action,
        ...state.jobs.slice(oldJob + 1)
      ];

      const checkingJobs = {
        ...state.checkingJobs
      };

      delete checkingJobs[action._id];

      return {
        ...state,
        jobs,
        checkingJobs
      };
    }
  },
  INITIAL_STATE
);
