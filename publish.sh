#!/usr/bin/env bash

npm version patch

npm run build:publish
git add --all
git commit -m "chore: ran npm publish"

git push

cd ./dist || exit
npm publish
