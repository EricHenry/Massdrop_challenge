# Massdrop Coding Challenge

## Starting the project

Make sure to have Docker and NodeJS installed. At the project root run `docker-compose up` to start up the project. The api is running on `http://localhost:3001` and the front end app will be running on `http://localhost:3000` make sure no other processes are running on those ports before starting the solution.

Navigate to `http://localhost:3000` in a browser to use the web app. Add a new job to the queue by typing in a valid url into the form. After adding a job to the queue, it will appear in the list below. If the job is still in progress, you can click the button to check the status of the job.

If for some reason the app is not coming up, try going into the api directory and run `yarn`. Do the same command in the frontend directory.

## Problem

Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

Example:

User submits www.google.com to your endpoint. The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result. The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com.

## Solution Design

Expose a REST api that can create a job and read jobs. The REST api does not have the ability to update or delete jobs. When a new job is created in the database, we send a message to a worker gueue to get the data at the provided url. I simulate the a message queue by using an rxjs stream. Specifically a Subject. Which allows us to insert valus into the stream and setup the stream in a way to react to those messages. When a new message is recieved to process a url, the stream attempts to request the data at the endpoint. If successful it updates the job database entry with the data stringified. If the request was not successful it stringifies the error message and stores that. So the user knows the result of the job process.

The front end application leverages the REST Api to display all the jobs in a digestible list. At the top of the page a user is able to submit a url to process its response. Lastly the user has the ability to check the progress of a job that is in progress.

## Improvements

I think there would be some worth while improvements that this implementation would need before being production ready.

1. replace the stream queue with a proper messaging queue like RabbitMQ
2. create a separate service that takes messages off of the message bus to processes them.
3. Provide good error handling in the front end and overall feedback
4. clean up the user experience by adding more interactions in the front end

## Potential Enhancements

If this was something going live to users, I think adding a SocketIO service to provide users with real time feed back would be a really cool feature.
