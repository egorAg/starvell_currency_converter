import { ConfigService } from '@nestjs/config';

export const CryptonimusExchangeRateRoute = (
    config: ConfigService,
    from: string,
): string => {
    const baseUrl = config.get<string>('cryptonimus.baseUrl');
    const version = config.get<string>('cryptonimus.version');

    return `${baseUrl}/${version}/exchange-rate/${from}/list`;
};
