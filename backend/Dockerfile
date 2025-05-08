# Use official Python image
FROM python:3.11.8-slim


# Set the working directory in the container
WORKDIR /app

# Copy only necessary files first for caching
COPY requirements.txt ./

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the backend code
COPY . .

# set arg
ARG NEXTJS_ENV

# Expose the backend port
EXPOSE 8000

# Command to run the FastAPI application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
