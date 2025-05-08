FROM docker:latest

WORKDIR /app

# Copy necessary files
COPY compose.yml .
COPY .env .

CMD ["docker-compose", "up", "-d"]
