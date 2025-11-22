import { Test, TestingModule } from '@nestjs/testing';
import { RateProviderService } from './rate-provider.service';
import { ConverterCacheService } from '../converter-cache/converter-cache.service';
import { CryptonimusApiService } from '../../../cryptonimus/services/cryptonimus-api/cryptonimus-api.service';
import { ConfigService } from '@nestjs/config';

import type { ICryptonimusRate } from '../../../cryptonimus/interfaces/cryptonimus-rate.interface';

describe('RateProviderService', () => {
    let service: RateProviderService;
    let cache: ConverterCacheService;
    let api: CryptonimusApiService;

    const mockCache = {
        getRates: jest.fn(),
        setRates: jest.fn(),
    };

    const mockApi = {
        getRates: jest.fn(),
    };

    const mockConfig = {
        get: (key: string) => {
            if (key === 'CACHE_TTL_MS') return '900000';
            return null;
        },
    };

    const exampleRates: ICryptonimusRate[] = [
        { from: 'ETH', to: 'USDT', course: '3000' },
        { from: 'ETH', to: 'BTC', course: '0.05' },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RateProviderService,
                { provide: ConverterCacheService, useValue: mockCache },
                { provide: CryptonimusApiService, useValue: mockApi },
                { provide: ConfigService, useValue: mockConfig },
            ],
        }).compile();

        service = module.get(RateProviderService);
        cache = module.get(ConverterCacheService);
        api = module.get(CryptonimusApiService);

        jest.clearAllMocks();
    });

    it('должен вернуть данные из кэша, если они есть', async () => {
        mockCache.getRates.mockResolvedValue(exampleRates);

        const result = await service.getRates('ETH');

        expect(result).toEqual(exampleRates);

        expect(mockCache.getRates).toHaveBeenCalledWith('ETH');

        expect(api.getRates).not.toHaveBeenCalled();

        expect(mockCache.setRates).not.toHaveBeenCalled();
    });

    it('должен запросить API и записать результат в кэш, если в кэше пусто', async () => {
        mockCache.getRates.mockResolvedValue(undefined);
        mockApi.getRates.mockResolvedValue(exampleRates);

        const result = await service.getRates('ETH');

        expect(mockCache.getRates).toHaveBeenCalledWith('ETH');

        expect(api.getRates).toHaveBeenCalledWith('ETH');

        expect(mockCache.setRates).toHaveBeenCalledWith(
            'ETH',
            exampleRates,
            900000,
        );

        expect(result).toEqual(exampleRates);
    });

    it('должен использовать TTL из ConfigService', async () => {
        mockCache.getRates.mockResolvedValue(undefined);
        mockApi.getRates.mockResolvedValue(exampleRates);

        await service.getRates('ETH');

        expect(mockCache.setRates).toHaveBeenCalledWith(
            'ETH',
            exampleRates,
            900000,
        );
    });
});
