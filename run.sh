podman build -t sdm:v1.0.2 .
podman run -d --name sdm-site -p 8080:80 sdm:v1.0.2
