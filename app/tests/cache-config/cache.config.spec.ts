import Keyv from 'keyv';
import KeyvRedis, {RedisClientType} from '@keyv/redis';
import {cacheConfigFactory} from "../../src/cache-config/cache-config.factory";

describe('cacheFactory', () => {
    const mockConfig = {
        get: (key: string) => {
            switch (key) {
                case 'CACHE_TTL_MS':
                    return '900000';
                case 'REDIS_HOST':
                    return 'localhost';
                case 'REDIS_PORT':
                    return '6379';
                default:
                    return null;
            }
        },
    } as any;

    it('должен вернуть объект со store', async () => {
        const result = await cacheConfigFactory(mockConfig);

        expect(result).toBeDefined();
        expect(Array.isArray(result.stores)).toBe(true);
        expect(result.stores.length).toBe(2);
    });

    it('первый store — in-memory, второй — redis', async () => {
        const result = await cacheConfigFactory(mockConfig);

        const memStore = result.stores[0];
        const redisStore = result.stores[1];

        expect(memStore).toBeInstanceOf(Keyv);
        expect(redisStore).toBeInstanceOf(Keyv);

        expect((memStore as any).opts.ttl).toBe(900000);
        expect((redisStore as any).opts.ttl).toBe(900000);

        expect((redisStore as any).opts.store).toBeInstanceOf(KeyvRedis);
    });

    it('Redis URL должен быть корректный', async () => {
        const result = await cacheConfigFactory(mockConfig);

        const redisStore = result.stores[1] as any;
        const redis = redisStore.opts.store as KeyvRedis<any>;

        const redisClient = redis.client as RedisClientType;

        expect(redisClient.options?.url).toBeDefined();
    });
});
