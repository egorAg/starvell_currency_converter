import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConverterCacheService } from '../converter-cache/converter-cache.service';
import { CryptonimusApiService } from '../../../cryptonimus/services/cryptonimus-api/cryptonimus-api.service';
import type { ICryptonimusRate } from '../../../cryptonimus/interfaces/cryptonimus-rate.interface';

@Injectable()
export class RateProviderService {
    private readonly ttl: number;

    constructor(
        private readonly cache: ConverterCacheService,
        private readonly cryptonimus: CryptonimusApiService,
        private readonly config: ConfigService,
    ) {
        this.ttl = Number(this.config.get('CACHE_TTL_MS'));
    }

    async getRates(from: string): Promise<ICryptonimusRate[]> {
        let cached = await this.cache.getRates(from);

        if (cached) return cached;

        const fresh = await this.cryptonimus.getRates(from);
        await this.cache.setRates(from, fresh, this.ttl);

        return fresh;
    }
}
