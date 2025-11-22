import {Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { ICryptonimusRate } from '../../../cryptonimus/interfaces/cryptonimus-rate.interface';
import {CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class ConverterCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
    ) {}

    getCacheKey(from: string) {
        return `cryptonimus:rates:${from}`;
    }

    async getRates(from: string): Promise<ICryptonimusRate[] | undefined> {
        return this.cache.get<ICryptonimusRate[]>(this.getCacheKey(from));
    }

    async setRates(from: string, rates: ICryptonimusRate[], ttl: number) {
        return this.cache.set(this.getCacheKey(from), rates, ttl);
    }
}
