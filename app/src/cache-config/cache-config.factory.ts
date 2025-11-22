import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';
import { CacheableMemory } from 'cacheable';
import { ConfigService } from '@nestjs/config';

export async function cacheConfigFactory(config: ConfigService) {
    const ttl = Number(config.get('CACHE_TTL_MS')) || 900000;

    const redisStore = new KeyvRedis(
        `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`
    );

    const memoryStore = new CacheableMemory({
        ttl,
        lruSize: 5000,
    });

    return {
        stores: [
            new Keyv({ store: memoryStore, ttl }),
            new Keyv({ store: redisStore, ttl }),
        ],
    };
}
