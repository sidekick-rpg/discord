PROJECT=sidekick-rpg/discord

build:
	docker build -t "$(PROJECT)" .

node:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" node $(ARGS)

npm:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" npm $(ARGS)

shell:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" sh

shell-root:
	docker run -it -v $(CURDIR):/usr/src/app -u root "$(PROJECT)" sh

test:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" npm run test

coverage:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" npm run coverage

up:
	docker run -it -v $(CURDIR):/usr/src/app "$(PROJECT)" node index.js

.PHONY: test coverage
