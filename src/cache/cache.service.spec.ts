import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import {getModelToken} from '@nestjs/mongoose';
import {Cache} from './schemas/cache.schema'


describe('CacheService', () => {
  let service: CacheService;

  const mockCaches = [{
    key: "test",
    data: "data"
  }];


  const mockCacheRepository = {
    find: jest.fn().mockResolvedValue(mockCaches)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService, {
          provide: getModelToken(Cache.name),
          useValue: mockCacheRepository
        }
      ],
    })
    .compile();

    service = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the list of cache objects', async() => {
    const results = await service.findAll();

    expect(results).toContainEqual({key: "test", data: 'data'})
  });
});
