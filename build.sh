#!/bin/sh
set -e

npx vite build ./src
cp -R src/config dist/
cp -R src/resources dist/
