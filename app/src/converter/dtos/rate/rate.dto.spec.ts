import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RateDto } from './rate.dto';
import { CurrencyCode } from '../../../shared/currency-code.enum';

describe('RateDto', () => {
    it('валидный DTO', async () => {
        const dto = plainToInstance(RateDto, {
            from: CurrencyCode.BTC,
            to: CurrencyCode.USDT,
        });

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('невалидные enum должны фейлиться', async () => {
        const dto = plainToInstance(RateDto, {
            from: 'INVALID',
            to: 'XYZ',
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});
