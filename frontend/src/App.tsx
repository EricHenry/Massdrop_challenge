import React, { FC, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { UrlProcssorForm } from "./components/url-processor-form";
import { State, Actions } from "./redux";
import { JobList } from "./components/job-list";

type StateProps = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: State) => ({
  loading: state.loadingJobs,
  jobs: state.jobs,
  url: state.url,
  checkingJobs: state.checkingJobs
});

type DispatchProps = typeof mapDispatchToProps;
const mapDispatchToProps = {
  loadJobsStart: Actions.loadingJobsStart,
  loadJobsComplete: Actions.loadingJobsComplete,

  updateUrl: Actions.updateUrl,

  createJobStart: Actions.createJobStart,
  createJobComplete: Actions.createJobComplete,

  checkJobStart: Actions.checkJobStart,
  checkJobComplete: Actions.checkJobComplete
};

type Props = StateProps & DispatchProps;
const App: FC<Props> = props => {
  useEffect(() => {
    const fetchData = async () => {
      props.loadJobsStart();
      try {
        const response = await axios.get("http://localhost:3001/api/job");
        props.loadJobsComplete(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <header>
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="#">
            URL Processor
          </a>
        </nav>
      </header>
      <div className="container pt-2">
        <UrlProcssorForm
          url={props.url}
          updateUrl={props.updateUrl}
          createJobStart={props.createJobStart}
          createJobComplete={props.createJobComplete}
        />
        <JobList
          jobs={props.jobs}
          checkingJobs={props.checkingJobs}
          checkJobStart={props.checkJobStart}
          checkJobComplete={props.checkJobComplete}
        />
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
