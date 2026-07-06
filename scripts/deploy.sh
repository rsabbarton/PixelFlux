#!/bin/sh
set -e

rm -rf live
mkdir live
cp -R dist/* live/

node scripts/deployupdate.js