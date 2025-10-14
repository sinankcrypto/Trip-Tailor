#!/bin/sh

# Wait for PostgreSQL to start
echo "Waiting for postgres at $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "PostgreSQL started."

# Only run migrations if this is the web container
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  python manage.py migrate
fi

exec "$@"
