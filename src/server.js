import App from './app/common/react/App';
import React from 'react';
import { StaticRouter, matchPath } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const JSON_RE = /^\/json\/*/;

const hookIntoTheSystem = (url) => {

   const context = {};
   const markup = renderToString(
      <StaticRouter context={context} location={url}>
         <App />
      </StaticRouter>
   );

   if (context.url) {
      res.redirect(context.url);
   }

   if(JSON_RE.test(url)) {
      return JSON.stringify({'yo': 'lo'});
   } else {
      return `<!doctype html>
 <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
         assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
      }
        ${
         process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
      }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`

   }
};


const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
     const result = hookIntoTheSystem(req.url);
     res.status(200);
     if(JSON_RE.test(req.url)) {
        console.log({result});
        res.header('Content-Type', 'application/json').send(result);
     } else {
        res.status(200).send(result);
     }
  });

export default server;
