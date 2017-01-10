docker pull sportnak/noteable:latest
docker pull sportnak/nginx

docker stop beta
docker rm beta

docker run -d -p 8080:8080 --name beta --link mongodb:mongo sportnak/noteable:latest

docker stop nginx
docker rm nginx
docker run -d -p 80:80 --name nginx --link beta:beta --link production:production sportnak/nginx