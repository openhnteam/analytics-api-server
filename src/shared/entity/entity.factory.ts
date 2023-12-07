import { Global, Injectable } from '@nestjs/common';
import { BaseEntity, EntityManager, EntityTarget, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class EntityFactory {
  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

  createEntity(enyity: EntityTarget<BaseEntity>, table: string): Repository<BaseEntity>{
    const repository = this.entityManager.getRepository(enyity);
    repository.metadata.tablePath = table
    return repository
  }
}
