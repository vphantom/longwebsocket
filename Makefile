BROWSERIFY := node_modules/.bin/browserify
JS         := node_modules/.bin/uglifyjs --compress --mangle --comments "/Free software under/"
JSLINT     := node_modules/.bin/eslint --fix

help:
	echo "Try one of: clean, build, lint"

clean:
	rm -f *.browser.js *.min.js *.min.js.map

build:	longwebsocket.min.js

lint:
	$(JSLINT) longwebsocket.js

%.browser.js:	%.js
	$(BROWSERIFY) -s LongWebSocket $< -o $@

%.min.js:	%.browser.js
	$(JS) --source-map $@.map -o $@ -- $<

.PHONY: help clean build lint

.SILENT:	help test

.PRECIOUS:	%.browser.js
