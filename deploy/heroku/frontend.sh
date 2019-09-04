#!/usr/bin/env bash

cd "$(dirname "$0")"
echo "Deploying the frontend"
cd ../../frontend
heroku container:push web -a awesome-bla
heroku container:release web -a awesome-bla