#!/bin/sh
set -e

node scripts/buildupdate.js

npx vite build ./src
cp -R src/config dist/
cp -R src/resources dist/
