import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ConvertDto } from '../../../src/converter/dtos/convert.dto';
import {CurrencyCode} from "../../../src/shared/currency-code.enum";

describe('ConvertDto', () => {
    it('валидный dto должно проходить валидацию', async () => {
        const dto = plainToInstance(ConvertDto, {
            from: CurrencyCode.ETH,
            to: CurrencyCode.USDT,
            amount: 10,
        });

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    });

    it('должен падать при неверном enum', async () => {
        const dto = plainToInstance(ConvertDto, {
            from: 'INVALID',
            to: CurrencyCode.ETH,
            amount: 10,
        });

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
    });

    it('должен падать при amount не числом', async () => {
        const dto = plainToInstance(ConvertDto, {
            from: CurrencyCode.ETH,
            to: CurrencyCode.USDT,
            amount: 'abc',
        });

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
    });

    it('@Type должен привести строку к числу', async () => {
        const dto = plainToInstance(ConvertDto, {
            from: CurrencyCode.ETH,
            to: CurrencyCode.USDT,
            amount: '5',
        });

        expect(dto.amount).toBe(5);
    });
});
