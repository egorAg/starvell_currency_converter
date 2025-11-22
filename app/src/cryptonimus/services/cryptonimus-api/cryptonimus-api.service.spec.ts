import { Test, TestingModule } from '@nestjs/testing';
import { CryptonimusApiService } from './cryptonimus-api.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpException } from '@nestjs/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CryptonimusApiService', () => {
    let service: CryptonimusApiService;
    let config: ConfigService;

    const mockConfig = {
        get: jest.fn((key: string) => {
            switch (key) {
                case 'cryptonimus.baseUrl':
                    return 'https://api.cryptomus.com';
                case 'cryptonimus.version':
                    return 'v1';
                default:
                    return null;
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CryptonimusApiService,
                {
                    provide: ConfigService,
                    useValue: mockConfig,
                },
            ],
        }).compile();

        service = module.get<CryptonimusApiService>(CryptonimusApiService);
        config = module.get<ConfigService>(ConfigService);

        jest.clearAllMocks();
    });

    it('должен корректно дергать axios.get с валидным URL', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                state: 0,
                result: [{ from: 'ETH', to: 'USDT', course: '2700' }],
            },
        });

        await service.getRates('ETH');

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://api.cryptomus.com/v1/exchange-rate/ETH/list'
        );
    });

    it('должен вернуть result когда state=0', async () => {
        const MOCK_RESULT = [
            { from: 'ETH', to: 'USDT', course: '2800' },
        ];

        mockedAxios.get.mockResolvedValue({
            data: {
                state: 0,
                result: MOCK_RESULT,
            },
        });

        const result = await service.getRates('ETH');

        expect(result).toEqual(MOCK_RESULT);
    });

    it('должен бросить HttpException если state!=0', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                state: 1,
                result: [],
            },
        });

        await expect(service.getRates('ETH')).rejects.toThrow(
            new HttpException('Cryptonimus API unavailable', 503),
        );
    });

    it('должен бросить HttpException при axios ошибке', async () => {
        mockedAxios.get.mockRejectedValue(new Error('network error'));

        await expect(service.getRates('ETH')).rejects.toThrow(
            new HttpException('Cryptonimus API unavailable', 503),
        );
    });
});
