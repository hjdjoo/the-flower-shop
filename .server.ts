
// import express, { Application, Request, Response, ErrorRequestHandler } from "express";
// import { ServerError } from "./server/types/server-types";
// import { router as apiRouter } from "./server/routes/api"

// import next from 'next'
// // import exp from "constants";


// /****** Express server for improved request handling...  ********/

// const dev = process.env.NODE_ENV !== 'production';
// const PORT = 3000;
// const hostname = 'localhost'
// const app = next({ dev: dev, hostname: hostname, port: PORT });

// const handle = app.getRequestHandler();

// app.prepare().then(() => {

//   const server = express();

//   // server.use('/api', apiRouter);

//   server.all('*', (req: Request, res: Response) => {
//     return handle(req, res)
//   });


//   // global error handler;
//   const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
//     const defaultError: ServerError = {
//       log: 'Unknown middleware error occurred',
//       status: 500,
//       message: {
//         err: 'Unknown error'
//       }
//     };

//     const errorObj = Object.assign(defaultError, err);

//     res.status(errorObj.status).json(errorObj)
//   };

//   server.use(errorHandler);

//   server.listen(PORT, () => {
//     console.log(`listening on port ${PORT}`)
//   });

// })


