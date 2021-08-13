import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), MongooseModule.forRoot(process.env.DB_URI), CacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
