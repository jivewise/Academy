#!/bin/zsh

if [ "$1" != "" ]; then
	GREP_STR='--grep "$1" '
fi

mocha $GREP_STR -w -R  nyan -r tests/mocha-init.js tests/back/*/*.js
