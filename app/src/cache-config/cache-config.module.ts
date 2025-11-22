import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import {cacheConfigFactory} from "./cache-config.factory";

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: cacheConfigFactory,
        }),
    ],
})
export class CacheConfigModule {}
