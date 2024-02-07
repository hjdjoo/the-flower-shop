
import express, { Application, Request, Response, ErrorRequestHandler } from "express";
import { ServerError } from "./server/types/server-types";

// const express = require('express');
// const { Application, Request, Response, ErrorRequestHandler } = express;

import next from 'next'
// const ServerError = require('./server/types/server-types')

const dev = process.env.NODE_ENV !== 'production';
const PORT = 3000;
const hostname = 'localhost'
const app = next({ dev: dev, hostname: hostname, port: PORT });

const handle = app.getRequestHandler();

app.prepare().then(() => {

  const server = express();

  // server.use('/api')

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res)
  });

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  });

})


