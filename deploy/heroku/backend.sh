#!/usr/bin/env bash

cd "$(dirname "$0")"
echo "Deploying the backend"
cd ../../backend
./gradlew bootJar
heroku container:push web -a awesome-bla-api
heroku container:release web -a awesome-bla-api
