import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Welcome to Catalog Service');
});

app.use(globalErrorHandler);

export default app;
