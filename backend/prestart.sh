#! /usr/bin/env bash

echo "Waiting for PostgreSQL..."

while ! pg_isready -h db -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"; do
    sleep 1
done

echo "PostgreSQL started"

echo "Running migrations"
python -m alembic upgrade head

echo "Migrations completed" 