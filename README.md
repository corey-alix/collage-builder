# collage-builder

Svelte demo app that integrates with Google Photos

## Build the scaffolding

I used create vite and followed the prompts, I selected the "Svelte" and "Typescript"
>npm create vite@latest collage-builder

## Setup to deploy to Netlify

[![Netlify Status](https://api.netlify.com/api/v1/badges/91fa781a-0ba5-44f4-ab28-cc70e3551989/deploy-status)](https://app.netlify.com/sites/becollage/deploys)

Open [just.be.collage](https://becollage.netlify.app/) on netlify.

## Setup Google Cloud

Add 'https://becollage.netlify.app' to the list of acceptable servers

## Setup Google OAUTH and API

Consume the "Google Applications API" and "Sign In With Google" and "Google Identity Services authorization API".

| About| url |
| -----| --- |
| gapi.client.photoslibrary     |"https://apis.google.com/js/api.js"|
| google.accounts.oauth2        |"https://accounts.google.com/gsi/client"|

The [Google API Client Library for JavaScript](https://github.com/google/google-api-javascript-client) are the client proxies for accessing Google services.

The [Sign In With Google](https://developers.google.com/identity/gsi/web/guides/overview) provides OAUTH2 authentication logic.
