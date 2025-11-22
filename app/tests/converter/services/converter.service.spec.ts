import { Test, TestingModule } from '@nestjs/testing';
import { ConverterService } from '../../../src/converter/services/converter.service';
import { RateProviderService } from '../../../src/converter/services/rate-provider.service';
import { NotFoundException } from '@nestjs/common';

describe('ConverterService', () => {
    let service: ConverterService;
    let provider: RateProviderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConverterService,
                {
                    provide: RateProviderService,
                    useValue: {
                        getRates: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ConverterService>(ConverterService);
        provider = module.get<RateProviderService>(RateProviderService);
    });

    describe('getRate', () => {
        it('должен вернуть курс если пара найдена', async () => {
            (provider.getRates as jest.Mock).mockResolvedValue([
                { from: 'ETH', to: 'USDT', course: '3000' },
            ]);

            const rate = await service.getRate('ETH', 'USDT');
            expect(rate).toBe(3000);
        });

        it('должен бросить NotFoundException если пары нет', async () => {
            (provider.getRates as jest.Mock).mockResolvedValue([]);

            await expect(service.getRate('ETH', 'USD'))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('convert', () => {
        it('должен корректно конвертировать сумму', async () => {
            (provider.getRates as jest.Mock).mockResolvedValue([
                { from: 'ETH', to: 'USDT', course: '2000' },
            ]);

            const res = await service.convert('ETH', 'USDT', 2);

            expect(res).toEqual({
                from: 'ETH',
                to: 'USDT',
                amount: 2,
                rate: 2000,
                convertedAmount: 4000,
            });
        });
    });
});
