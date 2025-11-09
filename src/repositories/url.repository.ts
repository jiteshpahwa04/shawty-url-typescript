import { UrlModel, IUrl } from "../models/Url";

export interface CreateUrl {
    originalUrl: string;
    shortUrl: string;
}

export interface UrlStats {
    id: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}

export class UrlRepository {
    async createUrl(data: CreateUrl): Promise<IUrl> {
        const url = new UrlModel(data);
        return await url.save();
    }

    async findByShortUrl(shortUrl: string): Promise<IUrl | null> {
        return await UrlModel.findOne({ shortUrl });
    }

    async findAll() {
        const urls = await UrlModel.find().select({
            _id: 1,
            originalUrl: 1,
            shortUrl: 1,
            clicks: 1,
            createdAt: 1,
            updatedAt: 1
        }).sort({ createdAt: -1 });

        return urls.map(url => ({
            id: url._id?.toString() || '',
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        }));
    }

    async incrementClicks(shortUrl: string): Promise<void> {
        await UrlModel.findOneAndUpdate(
            { shortUrl },
            { $inc: { clicks: 1 } },
            { new: true }
        );
    }

    async findStats(shortUrl: string) {
        const url = await UrlModel.findOne({ shortUrl }).select({
            _id: 1,
            originalUrl: 1,
            shortUrl: 1,
            clicks: 1,
            createdAt: 1,
            updatedAt: 1
        });

        if (!url) {
            return null;
        }

        return {
            id: url._id?.toString() || '',
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        };
    }
}