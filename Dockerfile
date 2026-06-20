# Use official slim Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependency definition
COPY pyproject.toml .

# Install dependencies using pip
# Since we are deploying a simple FastAPI app, we can use pip directly to install from pyproject.toml
RUN pip install --no-cache-dir .

# Copy application files
COPY main.py .
COPY static/ ./static/

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Run the web server
CMD ["python", "main.py"]
