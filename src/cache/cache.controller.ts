import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheService } from './cache.service';
import { CreateUpdateCacheDto } from './dto/create-update-cache.dto';
import {Cache} from './schemas/cache.schema';

@ApiTags('Cache')
@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @ApiOperation({summary: 'Get all the keys with data'})
  @ApiOkResponse({description: "Returns a list of cache keys with data", type: Cache, isArray: true})
  @Get()
  async findAll(): Promise<Cache[]> {
    return this.cacheService.findAll();
  }

  @ApiOperation({summary: 'Get data for the goven key'})
  @ApiOkResponse({description: "Returns data with key", type: Cache})
  @Get(':key')
  async findOne(@Param('key') key: string): Promise<Cache> {
    return this.cacheService.findOne(key);
  }

  @ApiOperation({summary: 'Create/Update the data for a given key'})
  @ApiOkResponse({description: 'Returns data with key', type: Cache}) 
  @Post(':key')
  async addOrUpdate(@Param('key') key: string, @Body() updateCacheDto: CreateUpdateCacheDto): Promise<Cache> {
    return this.cacheService.addOrUpdate(key, updateCacheDto);
  }

  @ApiOperation({summary: 'Remove given key from the cache'})
  @ApiOkResponse({description: "Returns an key with data", type: Cache})
  @Delete(':key')
  async remove(@Param('key') key: string): Promise<Cache> {
    return this.cacheService.remove(key);
  }

  @ApiOperation({summary: 'Remove all keys from the cache'})
  @ApiOkResponse({description: "Return `true` if data is deleted and false if no data is deleted", type: Boolean})
  @Delete()
  removeAll() {
    return this.cacheService.removeAll();
  }
}
