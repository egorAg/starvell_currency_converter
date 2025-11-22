import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from '../../shared/currency-code.enum';

export class ConvertDto {
    @ApiProperty({
        description: 'Валюта-источник',
        example: CurrencyCode.BTC,
        enum: CurrencyCode,
    })
    @IsEnum(CurrencyCode)
    from: CurrencyCode;

    @ApiProperty({
        description: 'Целевая валюта',
        example: CurrencyCode.USDT,
        enum: CurrencyCode,
    })
    @IsEnum(CurrencyCode)
    to: CurrencyCode;

    @ApiProperty({
        description: 'Сумма конвертации',
        example: 1.5,
        type: Number,
    })
    @Type(() => Number)
    @IsNumber()
    amount: number;
}
