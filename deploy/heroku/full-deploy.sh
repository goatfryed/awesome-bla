#!/usr/bin/env bash
# shortcut to deploy all

set -e
cd "$(dirname "$0")"
./deploy-backend.sh
./deploy-frontend.sh