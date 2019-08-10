# ORLIKER-API

## About
This is backend for creating and managing amateur soccer games, mainly on artifical grass fields that belong to schools. In Poland we have a lot of fields like this (called 'orlik'). You can make reservations on these fields to play with your friends, generally people make reservations for specific day and hour for whole year (like every friday 8pm). People make those reservations to play with their friends, but sometimes it's not easy to find enough players, so special groups exist on facebook where you can add a post like 'need 1-2 players for today at 8pm'. There are also situations, where someone declared his presence, but in the last minute he resigned - in the meantime someone else wanted to join, but there was enough players already, and now he could join,but than you need to call him or write to him on facebook. In general managing you own reservation involes a lot of calls / messages etc. The purpose of this backend and the apps that use it is to significantly facilitate this progressr.

## Backend for Orliker
- node
- express
- mongoose
- joi
- config
- lodash
- bcryptjs
- jwt
- winston
- jest

# Development
## Start server

`npm start`

##### Note: before starting server specify private key:

`export orliker_jwtPrivateKey=<KEY>`

## Start tests

`npm test`


# Formatting
Integrated eslint with prettier for airbnb styling guidelines
- [eslint-config-airbnb](https://github.com/airbnb/javascript)
- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise#readme)

## Settings in vs that I use for formatting code:

``` json
{
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "prettier.eslintIntegration": true
}
```
# TODOs (the api is not finished yet, a lot of things to rethink)
- add more tests (cover everything with them)
- integrate websockets
- rethink and implement premium accounts logic (add payments, payments history etc.)
- rethink whole db design
- deploy (+ mongodb in the cloud)
- logging in dev / production env
- add all routes with request and response body examples to README