import { Injectable, NotFoundException } from '@nestjs/common';
import { RateProvider } from '../providers/rate.provider';

@Injectable()
export class ConverterService {
    constructor(
        private readonly provider: RateProvider,
    ) {}

    async getRate(from: string, to: string): Promise<number> {
        const rates = await this.provider.getRates(from);

        const pair = rates.find(r => r.to === to);

        if (!pair) {
            throw new NotFoundException(`Курс пары ${from} → ${to} не найден`);
        }

        return Number(pair.course);
    }

    async convert(from: string, to: string, amount: number) {
        const rate = await this.getRate(from, to);

        return {
            from,
            to,
            amount,
            rate,
            convertedAmount: amount * rate,
        };
    }
}
