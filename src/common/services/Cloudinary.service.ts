import cloudinary from 'cloudinary';
import config from 'config';

import { FileData, FileStorage } from '../types/storage';

export class CloudinaryStorage implements FileStorage {
    private cloudinary = cloudinary.v2;

    constructor() {
        this.cloudinary.config({
            cloud_name: config.get('cloudinary.cloudName'),
            api_key: config.get('cloudinary.apiKey'),
            api_secret: config.get('cloudinary.apiSecret'),
        });
    }

    async upload(data: FileData): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                { public_id: data.fileName },
                (error, result) => {
                    if (error) {
                        return reject(
                            new Error(`Upload failed: ${error.message}`),
                        );
                    }
                    resolve(result?.secure_url);
                },
            );
            uploadStream.end(data.fileData);
        });
    }

    async delete(fileName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.destroy(fileName, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    }

    getObjectUri(fileName: string): string {
        const imageUrl = this.cloudinary.url(fileName);
        if (imageUrl) {
            return imageUrl;
        }

        throw new Error('Error while fetching image url: ' + fileName);
    }
}
