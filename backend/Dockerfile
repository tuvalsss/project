FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Create and set permissions for the prestart script
COPY prestart.sh /app/prestart.sh
RUN chmod +x /app/prestart.sh

# Set up entrypoint to run prestart.sh and then the main command
ENTRYPOINT ["/bin/bash", "-c", "/app/prestart.sh && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
