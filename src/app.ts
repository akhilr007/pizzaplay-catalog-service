import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { globalErrorHandler } from './common/middlewares/globalErrorHandler';
import v1Routes from './routes/v1.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', v1Routes);

app.get('/', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Welcome to Catalog Service');
});

app.use(globalErrorHandler);

export default app;
