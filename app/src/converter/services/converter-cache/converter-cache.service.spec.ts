import { Test, TestingModule } from '@nestjs/testing';
import { ConverterCacheService } from './converter-cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { ICryptonimusRate } from '../../../cryptonimus/interfaces/cryptonimus-rate.interface';

describe('ConverterCacheService', () => {
    let service: ConverterCacheService;
    let cache: Cache;

    const mockCache = {
        get: jest.fn(),
        set: jest.fn(),
    } as unknown as Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConverterCacheService,
                { provide: CACHE_MANAGER, useValue: mockCache },
            ],
        }).compile();

        service = module.get(ConverterCacheService);
        cache = module.get(CACHE_MANAGER);

        jest.clearAllMocks();
    });

    describe('getCacheKey', () => {
        it('должен формировать правильный ключ', () => {
            const key = service.getCacheKey('ETH');
            expect(key).toBe('cryptonimus:rates:ETH');
        });
    });

    describe('getRates', () => {
        it('должен вызывать cache.get с корректным ключом', async () => {
            mockCache.get = jest.fn().mockResolvedValue([{ from: 'ETH', to: 'USDT', course: '3000' }]);

            const result = await service.getRates('ETH');

            expect(mockCache.get).toHaveBeenCalledWith('cryptonimus:rates:ETH');
            expect(result).toEqual([{ from: 'ETH', to: 'USDT', course: '3000' }]);
        });

        it('должен вернуть undefined, если значение отсутствует', async () => {
            mockCache.get = jest.fn().mockResolvedValue(undefined);

            const result = await service.getRates('ETH');

            expect(result).toBeUndefined();
        });
    });

    describe('setRates', () => {
        it('должен вызывать cache.set с правильными аргументами', async () => {
            const rates: ICryptonimusRate[] = [
                { from: 'ETH', to: 'USDT', course: '2500' },
            ];

            mockCache.set = jest.fn().mockResolvedValue(undefined);

            await service.setRates('ETH', rates, 5000);

            expect(mockCache.set).toHaveBeenCalledWith(
                'cryptonimus:rates:ETH',
                rates,
                5000,
            );
        });
    });
});
