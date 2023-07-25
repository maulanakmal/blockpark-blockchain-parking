# Use a Go base image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the Go modules files
COPY go.mod .
COPY go.sum .

# Download the Go modules dependencies
RUN go mod download

# Copy the source code to the container
COPY . .

# Build the Go application
RUN go build -o app ./cmd

# Set the entry point command to run the application
RUN export $(cat parkingintegrator.env | xargs)
CMD ["./app"]
