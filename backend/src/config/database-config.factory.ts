import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class DatabaseConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.pass'),
      database: this.configService.get<string>('database.name'),
      // schema: this.configService.get<string>('database.schema'),
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: this.configService.get<boolean>('database.synchronize'),
    };
  }
}
