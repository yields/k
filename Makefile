
build: components index.js proto.js
	@component build

components: component.json
	@component install --dev

clean:
	@rm -fr build components template.js

test:
	@open test/index.html

.PHONY: clean test
