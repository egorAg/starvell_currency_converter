import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ConverterService } from '../services/converter.service';
import { RateDto } from '../dtos/rate.dto';
import { ConvertDto } from '../dtos/convert.dto';

@ApiTags('converter')
@Controller('converter')
export class ConverterController {
    constructor(private readonly service: ConverterService) {}

    @ApiOperation({
        summary: 'Получить актуальный курс валюты',
        description: 'Возвращает текущий курс валюты "from" по отношению к валюте "to".',
    })
    @ApiOkResponse({
        description: 'Курс успешно получен',
        schema: {
            example: 2725.88694,
        },
    })
    @ApiBadRequestResponse({
        description: 'Некорректные параметры запроса (валидация)',
    })
    @ApiNotFoundResponse({
        description: 'Курс пары не найден',
    })
    @Get('rate')
    getRate(@Query() dto: RateDto) {
        return this.service.getRate(dto.from, dto.to);
    }

    @ApiOperation({
        summary: 'Конвертация суммы между валютами',
        description: 'Конвертирует указанную сумму из "from" в "to" на основе текущего курса Cryptomus.',
    })
    @ApiOkResponse({
        description: 'Сумма успешно конвертирована',
        schema: {
            example: {
                from: 'ETH',
                to: 'USDT',
                amount: 2,
                rate: 2727.12482,
                convertedAmount: 5454.24964,
            },
        },
    })
    @ApiBadRequestResponse({
        description: 'Некорректные параметры запроса (валидация)',
    })
    @ApiNotFoundResponse({
        description: 'Курс пары не найден',
    })
    @Get()
    convert(@Query() dto: ConvertDto) {
        return this.service.convert(dto.from, dto.to, dto.amount);
    }
}
