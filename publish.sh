#!/usr/bin/env bash

npm run build:publish
npm version patch
git add --all
git commit -m "chore: ran npm publish"
git push

cd ./dist || exit
npm publish
