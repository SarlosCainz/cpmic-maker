NAME := comic-maker
REGISTRY := sarlos

build: build-npm
	docker build -t $(REGISTRY)/$(NAME)  .

build-test: build-npm
	docker build -t $(REGISTRY)/$(NAME):test .

push:
	docker push $(REGISTRY)/$(NAME)

push-test:
	docker push $(REGISTRY)/$(NAME):test

build-npm:
	cd ui && npm run build

clean:
	docker system prune -f
