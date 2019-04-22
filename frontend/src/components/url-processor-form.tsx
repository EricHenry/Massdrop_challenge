import React, { FC, SyntheticEvent } from "react";
import axios from "axios";

import { Actions } from "../redux";

type Props = {
  url: string;
  updateUrl: typeof Actions.updateUrl;
  createJobStart: typeof Actions.createJobStart;
  createJobComplete: typeof Actions.createJobComplete;
};

export const UrlProcssorForm: FC<Props> = props => {
  const submitJob = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.createJobStart();
    try {
      const response = await axios.post("http://localhost:3001/api/job", {
        url: props.url
      });
      props.createJobComplete(response.data.data);
    } catch (e) {
      console.log(e);
    }

    props.updateUrl("");
  };
  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={submitJob}>
          <div className="form-group row">
            <label htmlFor="UrlInput" className="col-sm-2 col-form-label">
              Enter Url
            </label>
            <div className="col-sm-8">
              <input
                type="url"
                className="form-control"
                id="UrlInput"
                aria-describedby="urlHelp"
                placeholder="https://google.com"
                value={props.url}
                onChange={e => {
                  props.updateUrl(e.target.value);
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary col-sm-1">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
UrlProcssorForm.displayName = "UrlProcessorForm";
