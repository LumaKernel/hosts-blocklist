
.PHONY: fallback
fallback: build

.PHONY: build
build: scripts/build.js
	node scripts/build.js
