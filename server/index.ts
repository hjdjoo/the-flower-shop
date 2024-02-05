import express, { Application, Request, Response, ErrorRequestHandler } from "express";
import cors from 'cors';
import { ServerError } from './types/server-types'

const app = express();
const PORT = 5000



app.use(cors());


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})