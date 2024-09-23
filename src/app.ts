import express, { Request, Response } from 'express';

import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to Auth Service');
});

app.use(globalErrorHandler);

export default app;
