# Use the official Python image from the Docker Hub
FROM python:3.11.8-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the Django project files to the container
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Create a non-root user and switch to it
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser /app
USER appuser

# Run the Django application with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "intellifind.wsgi:application", "--workers", "3"]