#!/bin/bash
CUR_ENV="development"

if [ "$1" != "" ]; then
	CUR_ENV="$1"
fi
export NODE_ENV=$CUR_ENV
node --debug server.js
