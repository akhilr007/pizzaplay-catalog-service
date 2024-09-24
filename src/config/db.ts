import config from 'config';
import mongoose from 'mongoose';

const initDB = async () => {
    await mongoose.connect(config.get('database.url'));
};

export default initDB;
