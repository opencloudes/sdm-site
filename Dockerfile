# Use Nginx alpine as the lightweight web server base image
FROM docker.io/library/nginx:alpine

# Copy your local static files to the Nginx default HTML directory
COPY . /usr/share/nginx/html/

# Expose port 80 to access the web server
EXPOSE 80
