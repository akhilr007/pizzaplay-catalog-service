import config from 'config';

import app from './app';
import initDB from './config/db';
import logger from './config/logger';

const startServer = async () => {
    const PORT = config.get('server.port');
    try {
        await initDB();
        logger.info('Database started successfully');
        app.listen(PORT, () => logger.info(`Listening on PORT : ${PORT}`));
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message);
        }
        process.exit(1);
    }
};

startServer();
