#! /usr/bin/env bash

set -e
set -x

# Run migrations first
alembic upgrade head

# Let the DB start and initialize
python app/backend_pre_start.py

# Create initial data in DB
python app/initial_data.py
