NAME := who-maker
REGISTRY := sarlos
RELEASE := release/release.zip
RELEASE_FILES := misc/docker-compose.yml \
	misc/static/f910-shin-comic-2.04.otf \
	misc/static/570537b2-c140-4201-9edd-812a135b47c0.png

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

release: $(RELEASE)

$(RELEASE): $(RELEASE_FILES)
	zip -j $(RELEASE) $(RELEASE_FILES)
