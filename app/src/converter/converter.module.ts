import { Module } from '@nestjs/common';

import { ConverterService } from './services/converter/converter.service';
import { RateProviderService } from './services/rate-provider/rate-provider.service';
import { ConverterCacheService } from './services/converter-cache/converter-cache.service';

import { CryptonimusModule } from '../cryptonimus/cryptonimus.module';
import { ConverterController } from './controllers/converter.controller';

@Module({
    imports: [
        CryptonimusModule,
    ],
    controllers: [
        ConverterController,
    ],
    providers: [
        ConverterService,
        RateProviderService,
        ConverterCacheService,
    ],
    exports: [
        ConverterService,
    ],
})
export class ConverterModule {}
