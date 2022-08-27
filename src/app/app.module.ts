import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { UserModule } from '../user/user.module';
import DBUser from '../user/entities/user.entity';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
        validationSchema: Joi.object({
            DATABASE_HOST: Joi.string().required(),
            DATABASE_PORT: Joi.number().required(),
            DATABASE_USER: Joi.string().required(),
            DATABASE_PASSWORD: Joi.string().required(),
            DATABASE_NAME: Joi.string().required(),
        }),
        isGlobal: true,
        envFilePath: `${process.cwd()}/env/${ENV}.env`,
        load: [],
    }),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DATABASE_HOST'),
            port: configService.get('DATABASE_PORT'),
            username: configService.get('DATABASE_USER'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get('DATABASE_NAME'),
            entities: [DBUser],
            synchronize: true, // never make it true in Production, otherwise you might lose data
            logging: true,
            seeds: ["src/db/seeder/seeds/*{.ts,.js}"],
            factories: ["src/db/seeder/factories/*{.ts,.js}"],
        }),
        inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
