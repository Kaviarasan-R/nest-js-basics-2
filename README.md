# Turbo Repo

To install a npm package in workspace, `npm i --workspace=apps/client dotenv`

## Commands

To create a library: `nest g library my-library`
To create a module: `nest g module my-module`
To create a service: `nest g service my-service`

## Notes

Make sure to hide /api/v1 routes when try to use in clients browser url, then it should return html page of 404 from backend.
Or try to authenticate and redirect the route to client's route.

## Docs

<a href="https://youtu.be/-rcRf7yswfM?si=m48jwA886vR76wPC">How to send email using Gmail API (uses OAuth2 & Nodemailer)</a>

https://developers.google.com/oauthplayground/
