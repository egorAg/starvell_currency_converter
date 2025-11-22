import { registerAs } from '@nestjs/config';

export default registerAs('cryptonimus', () => ({
    baseUrl: process.env.CRYPTONIMUS_BASE_URL ?? 'https://api.cryptomus.com',
    version: process.env.CRYPTONIMUS_VERSION ?? 'v1',
}));
