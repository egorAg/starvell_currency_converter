import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CryptonimusExchangeRateRoute } from '../../routes/cryptonimus-exchange-rate.route';
import {ICryptonimusRatesResponse} from "../../interfaces/cryptonimus-rates-response.interface";

@Injectable()
export class CryptonimusApiService {
    constructor(private readonly config: ConfigService) {}

    async getRates(from: string) {
        const url = CryptonimusExchangeRateRoute(this.config, from);

        try {
            const { data } = await axios.get<ICryptonimusRatesResponse>(url);

            if (data.state !== 0) {
                throw new Error('Cryptonimus error code');
            }

            return data.result;
        } catch (error) {
            throw new HttpException('Cryptonimus API unavailable', 503);
        }
    }
}
