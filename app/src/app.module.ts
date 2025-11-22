import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {CryptonimusModule} from "./cryptonimus/cryptonimus.module";
import {ConverterModule} from "./converter/converter.module";
import cryptonimusConfig from "./cryptonimus/config/cryptonimus.config";
import {CacheConfigModule} from "./cache-config/cache-config.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env.local', '.env'],
      expandVariables: true,
      load: [cryptonimusConfig]
    }),
    CacheConfigModule,
    CryptonimusModule,
    ConverterModule,
  ],
})
export class AppModule {}
