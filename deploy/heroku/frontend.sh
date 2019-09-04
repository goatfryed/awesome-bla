#!/usr/bin/env bash

cd "$(dirname "$0")"
echo "Deploying the frontend"
cd ../../frontend
heroku container:push web -a awesome-bla --arg BACKEND_URL="https://awesome-bla-api.herokuapp.com"
heroku container:release web -a awesome-bla