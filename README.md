# JWT PERN Example
An example API that handles authentication using JSON Web Tokens.
Both access tokens and refresh tokens are implemented. Additionally, refresh tokens are stored in a HttpOnly cookie which prevents client-side scripts from accessing it.

Inspired by the following post: 

https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/


## DEV
Rename .sample-env to .env
Create 2 different secret tokens and paste into .env
To create a secret type: node then...
(require('crypto').randomBytes(64).toString('hex'))

## USEFUL VSCODE EXTENSIONS
REST Client - humao.rest-client
requests.rest contains example API calls that can be called with the above extension (so no need for POSTMAN ;-( )
