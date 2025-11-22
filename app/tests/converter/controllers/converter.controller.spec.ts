import {Test, TestingModule} from '@nestjs/testing';
import {ConverterController} from '../../../src/converter/controllers/converter.controller';
import {ConverterService} from '../../../src/converter/services/converter.service';
import {RateDto} from '../../../src/converter/dtos/rate.dto';
import {ConvertDto} from '../../../src/converter/dtos/convert.dto';
import {NotFoundException} from '@nestjs/common';
import {CurrencyCode} from "../../../src/shared/currency-code.enum";

describe('ConverterController', () => {
    let controller: ConverterController;
    let service: ConverterService;

    const mockService = {
        getRate: jest.fn(),
        convert: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConverterController],
            providers: [
                {
                    provide: ConverterService,
                    useValue: mockService
                },
            ],
        }).compile();

        controller = module.get<ConverterController>(ConverterController);
        service = module.get<ConverterService>(ConverterService);

        jest.clearAllMocks();
    });

    describe('getRate', () => {
        it('должен вызвать service.getRate с корректными параметрами', async () => {
            mockService.getRate.mockResolvedValue(3000);

            const dto: RateDto = {
                from: CurrencyCode.ETH,
                to: CurrencyCode.USDT
            };

            const result = await controller.getRate(dto);

            expect(service.getRate).toHaveBeenCalledWith(CurrencyCode.ETH, CurrencyCode.USDT);
            expect(result).toBe(3000);
        });

        it('должен пробрасывать NotFoundException из сервиса', async () => {
            mockService.getRate.mockRejectedValue(new NotFoundException());

            const dto: RateDto = {
                from: CurrencyCode.ETH,
                to: CurrencyCode.USDT
            };

            await expect(controller.getRate(dto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('convert', () => {
        it('должен вызвать service.convert с корректными параметрами', async () => {
            const mockResponse = {
                from: CurrencyCode.ETH,
                to: CurrencyCode.USDT,
                amount: 2,
                rate: 2700,
                convertedAmount: 5400,
            };

            mockService.convert.mockResolvedValue(mockResponse);

            const dto: ConvertDto = {
                from: CurrencyCode.ETH,
                to: CurrencyCode.USDT,
                amount: 2,
            } as ConvertDto;

            const result = await controller.convert(dto);

            expect(service.convert).toHaveBeenCalledWith(CurrencyCode.ETH, CurrencyCode.USDT, 2);
            expect(result).toEqual(mockResponse);
        });

        it('должен пробрасывать NotFoundException из сервиса', async () => {
            mockService.convert.mockRejectedValue(new NotFoundException());

            const dto: ConvertDto = {
                from: CurrencyCode.ETH,
                to: 'UNK',
                amount: 10,
            } as unknown as ConvertDto;

            await expect(controller.convert(dto)).rejects.toThrow(NotFoundException);
        });
    });
});
