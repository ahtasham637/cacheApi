import { Test, TestingModule } from '@nestjs/testing';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';

describe('CacheController', () => {
  let controller: CacheController;
  

  const mockCaches = [{
    key: "test",
    data: "data"
  }];

  const mockCacheService = {
    findAll: jest.fn().mockResolvedValue(mockCaches),
    findOne: jest.fn().mockImplementation((key) => Promise.resolve({
      key,
      data: 'data'
    })),
    addOrUpdate: jest.fn().mockImplementation((key, dto) => Promise.resolve({
      key,
      ...dto
    })),
    remove: jest.fn().mockImplementation((key) => Promise.resolve({key})),
    removeAll: jest.fn().mockImplementation(() => Promise.resolve(true))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheController],
      providers: [CacheService],
    })
    .overrideProvider(CacheService)
    .useValue(mockCacheService)
    .compile();

    controller = module.get<CacheController>(CacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of Cache objects', async () => {
    const key = 'test';
    const data = 'data';

    const results = await controller.findAll();

    expect(results).toContainEqual({key, data});
  });


  it('should return cache object of the given key', async () => {

    const key = "test";
    const data = 'data';
    const result = await controller.findOne(key);
    
    expect(result).toMatchObject({key, data});
  });

  
  it('should add add data to the given key', async() => {

    const key = "test";
    const dto = {data: 'data'};

    const result = await controller.addOrUpdate(key, dto);

    expect(result).toMatchObject({key, data: dto.data})
  });


  it('should remove data of the given key', async() => {

    const key = "test";
    const result = await controller.remove(key);

    expect(result).toMatchObject({key})
  })

  it('should remove all the keys', async() => {

    const key = "test";
    const result = await controller.removeAll();

    expect(result).toEqual(true)
  })
  
});
