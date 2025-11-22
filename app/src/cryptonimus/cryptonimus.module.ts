import { Module } from '@nestjs/common';
import { CryptonimusApiService } from './services/cryptonimus-api/cryptonimus-api.service';

@Module({
    providers: [CryptonimusApiService],
    exports: [CryptonimusApiService],
})
export class CryptonimusModule {}