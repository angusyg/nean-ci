#!/bin/bash

APP_REPO=$1
APP_NAME=$2

echo "Cloning repository from $APP_REPO"
git clone $APP_REPO

cd $APP_NAME

git checkout develop

echo "Running test on develop branch"
npm test

echo "Bumping version"
git_tag=`npm --no-git-tag-version version minor`
version=${git_tag:1}

echo "New version $git_tag"

echo "Creating release branch"
git checkout -b release/$version
git push --set-upstream origin release/$version

echo "Merging release branch to master branch"
git checkout master
git merge --no-ff release/$version

echo "Creating release tag $git_tag"
git tag -a -m "Release $git_tag" $git_tag 

echo "Merging release branch to develop branch"
git checkout develop
git merge --no-ff release/$version

echo "Pushing all changes to repository"
git push --all
git push --tags

cd ..

echo "Cleaning build directory"
rm -rf ./$APP_NAME
