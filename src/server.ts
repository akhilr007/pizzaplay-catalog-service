import config from 'config';

import app from './app';
import logger from './configs/logger';

const startServer = () => {
    const PORT = config.get('server.port');
    try {
        app.listen(PORT, () => logger.info(`Listening on PORT : ${PORT}`));
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message);
        }
        process.exit(1);
    }
};

startServer();
