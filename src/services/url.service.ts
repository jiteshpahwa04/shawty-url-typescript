import { serverConfig } from "../config";
import { CacheRepository } from "../repositories/cache.repository";
import { UrlRepository } from "../repositories/url.repository";
import { toBase62 } from "../utils/base62";
import { NotFoundError } from "../utils/errors/app.error";

export class UrlService {
    constructor(
        private readonly urlRepository: UrlRepository, 
        private readonly cacheRepository: CacheRepository
    ) {}

    async createShortUrl(originalUrl: string) {
        const nextId = await this.cacheRepository.getNextId();
        const shortUrl = toBase62(nextId);

        const url = await this.urlRepository.createUrl({shortUrl, originalUrl});

        await this.cacheRepository.setUrlMapping(shortUrl, originalUrl);

        const baseUrl = serverConfig.BASE_URL.endsWith('/') ? serverConfig.BASE_URL.slice(0, -1) : serverConfig.BASE_URL;
        const fullUrl = `${baseUrl}/${shortUrl}`;

        return {
            id: url.id.toString(),
            shortUrl: shortUrl,
            originalUrl: url.originalUrl,
            fullUrl: fullUrl,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        };
    }

    async getOriginalUrl(shortUrl: string) {
        let originalUrl = await this.cacheRepository.getUrlMapping(shortUrl);
        if(originalUrl) {
            await this.urlRepository.incrementClicks(shortUrl);
            return {originalUrl, shortUrl};
        }

        const url = await this.urlRepository.findByShortUrl(shortUrl);
        if(!url) {
            throw new NotFoundError('Short URL not found');
        }

        originalUrl = url.originalUrl;
        await this.urlRepository.incrementClicks(shortUrl);
        await this.cacheRepository.setUrlMapping(shortUrl, originalUrl);
        return {originalUrl, shortUrl};
    }

    async incrementClickCount(shortUrl: string) {
        await this.urlRepository.incrementClicks(shortUrl);
    }
}