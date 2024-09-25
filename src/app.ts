import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { globalErrorHandler } from './common/globalErrorHandler';
import v1Routes from './routes/v1.routes';

const app = express();

app.use(express.json());

app.use('/api/v1', v1Routes);

app.get('/', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Welcome to Catalog Service');
});

app.use(globalErrorHandler);

export default app;
