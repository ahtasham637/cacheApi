import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Cache, CacheSchema} from './schemas/cache.schema';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Module({
  imports: [MongooseModule.forFeature([{name: Cache.name, schema: CacheSchema}])],
  controllers: [CacheController],
  providers: [CacheService]
})
export class CacheModule {}
