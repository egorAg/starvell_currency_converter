import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from '../../shared/currency-code.enum';

export class RateDto {
    @ApiProperty({
        description: 'Валюта-источник',
        example: CurrencyCode.BTC,
        enum: CurrencyCode,
    })
    @IsEnum(CurrencyCode)
    from: CurrencyCode;

    @ApiProperty({
        description: 'Валюта-назначение',
        example: CurrencyCode.USDT,
        enum: CurrencyCode,
    })
    @IsEnum(CurrencyCode)
    to: CurrencyCode;
}
