# Use an official Python runtime
FROM python:3.11-slim

# set workdir
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# install system deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev curl netcat-traditional postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# copy and install requirements
COPY ./requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt
RUN pip install gunicorn

# copy project
COPY . .

# make entrypoint executable
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# expose port
EXPOSE 8000

# default command
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "trip_tailor.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
