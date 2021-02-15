Deployed at https://d1p30jm808amvu.cloudfront.net/

# Github Actions

- This repo is setup to automatically deploy to an S3 bucket, `s3://covid-19-us-tracker`.
- You'll need to update `.github/workflows/production.yml` with your own bucket name for the action to work.
- You'll also need to go to the github UI and add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY values to the repo

# Docker workflow

- Build image: `docker build -t covid-19-us-cases .`
- Start the container: `docker run -dp 3000:3000 -v "$(pwd):/app" --name app covid-19-us-cases`
  - Forward container port 3000 to the host port 3000
  - Bind working directory to container's working directory as specified in `Dockerfile`
  - `app` will be the name of the container and will be used in other docker commands
- Tail/follow logs: `docker logs -f app`
  - You should see updates in the logs when you update files in the local directory.
- TODO: make this easier with docker-compose?

# Old notes

- The standard package.json was updated to allocate more memory to node so that the app would work on heroku
