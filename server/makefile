db:
	docker build -t matcha_db ~/goinfre/matcha/database &&  docker run --rm --name matcha_conntainer -p 5432:5432 matcha_db

docker:
	~/init_docker.sh 

backend:
	npm run dev -C "~/goinfre/matcha/server"


