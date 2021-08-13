import * as mongoose from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Cache, CacheDocument} from './schemas/cache.schema';
import { CreateUpdateCacheDto } from './dto/create-update-cache.dto';

import config from './../../config';

@Injectable()
export class CacheService {

  constructor(@InjectModel(Cache.name) private readonly cacheRepository: mongoose.Model<CacheDocument>) {}

  async findAll(): Promise<Cache[]> {
    const currentTimeInMinutes = this.getTimeInSeconds();

    const caches = await this.cacheRepository.find({ttl: {$gt: currentTimeInMinutes}});

    return caches;
  }

  async findOne(key: string): Promise<Cache> {
    let cacheData = await this.findByKey(key);
    const ttl = this.generateTtl();
    let data = '';

    let msg = 'Cache hit';

    if(!cacheData)
    {
      msg = 'Cache miss';

      data = this.generateRandomString();

      const hasSpace = await this.hasSpaceForData();

      if(hasSpace)
      {
        const newCacheData = await this.createByKey(key, data, ttl);
        return newCacheData;
      }
      else
      {
        /* 
         If there is no space for new data then the oldest key will be considered and data will be replaced with
         the oldest key 
        */
        cacheData = await this.getOldestKey(); 
      }
    }

    console.log(msg);
    const updateCacheData = await this.updateByKey(cacheData, data, ttl, key);

    return updateCacheData;
  }


  async addOrUpdate(key: string, createUpdateCacheDto: CreateUpdateCacheDto): Promise<Cache> {

    let cacheData = await this.findByKey(key);
    const {data} = createUpdateCacheDto;
    const ttl = this.generateTtl();

    if(!cacheData)
    {
      const hasSpace = await this.hasSpaceForData();

      if(hasSpace)
      {
        const newCacheData = await this.createByKey(key, data, ttl);
        return newCacheData;
      }
      else
      {
        /* 
         If there is no space for new data then the oldest key will be considered and data will be replaced with
         the oldest key 
        */
        cacheData = await this.getOldestKey(); 
      }
    }
    
    const updateCacheData = await this.updateByKey(cacheData, data, ttl, key);
    return updateCacheData;

  }
  

  async remove(key: string): Promise<Cache> {
    const cacheData = await this.findByKey(key);

    if(!cacheData)
    {
      throw new NotFoundException("The key was not found");
    }

    await cacheData.remove();

    return cacheData; 
  }


  async removeAll(): Promise<boolean>
  {
    const cacheData = await this.cacheRepository.find();

    if(cacheData.length > 0)
    {
      await this.cacheRepository.remove({});
      return true;
    }

    return false;
  }

  private async hasSpaceForData(): Promise<Boolean>
  {
    const cacheResults = await this.cacheRepository.countDocuments().exec();
    
    if(cacheResults < config.cache_limit)
    {
      return true;
    }
    
    return false;
  }

  private async getOldestKey(): Promise<CacheDocument>
  {
    const cacheData = await this.cacheRepository.findOne({}).sort({ttl: 'asc'}).exec();

    return cacheData;
  }

  private async findByKey(key: string): Promise<CacheDocument>
  {
    const currentTimeInMinutes = this.getTimeInSeconds();
    
    const result = await this.cacheRepository.findOne({key, ttl: {$gt: currentTimeInMinutes}});
    return result;
  }

  private async createByKey(key: string, data: string, ttl: number): Promise<CacheDocument>
  {
    const newData = new this.cacheRepository({key, data, ttl});
    return await newData.save();
  }

  private async updateByKey(cacheObject: CacheDocument, data: string = '', ttl: number, key?: string): Promise<CacheDocument>
  {
    if(data)
    {
      cacheObject.data = data;
    }

    if(key)
    {
      cacheObject.key = key;
    }

    cacheObject.ttl = ttl;

    return await cacheObject.save();
  }

  private generateRandomString()
  {
    return Math.random().toString(36).substr(2, 5);
  }

  private getTimeInSeconds(): number
  {
    const date = new Date();
    const seconds = Math.round(date.getTime() / 1000);

    return seconds;
  }

  //The minutesToLive should be in config/env file so that it can be updated based on requirements
  private generateTtl(): number
  {
    const minutesToLive = config.minutes_to_live;

    const date = new Date(); 
    

    date.setMinutes(date.getMinutes() + minutesToLive);

    const seconds = Math.round(date.getTime() / 1000);

    return seconds;
  }
}
