import app from './app';
import { Config } from './configs';
import logger from './configs/logger';

const startServer = () => {
    const PORT = Config.PORT;
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
