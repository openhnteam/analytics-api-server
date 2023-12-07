import { Injectable, Logger } from '@nestjs/common'
import { BaseService } from '@/shared/service/base.service'
import { InitVo } from '../vo/init.vo'
import { isEmpty } from '@/shared/utils/obj.utils'
import { DeviceNoEntity } from '../entity/device.no.entity';
import { EntityFactory } from '@/shared/entity/entity.factory';
import { curTs } from '@/shared/utils/time.utils';
import { InitRspDto } from '../dto/init.rsp.dto';

@Injectable()
export class InitService extends BaseService {
  private readonly logger = new Logger(InitService.name)

  constructor(
    private readonly entityFactory: EntityFactory,
  ) {
    super()
  }

  async init(vo: InitVo, appId: string) {
    const table = `device_no_${appId}`
    const repository = this.entityFactory.createEntity(DeviceNoEntity, table)

    // 查询设备
    const dbEntity = await repository.createQueryBuilder('entity')
      .where('entity.deviceId = :deviceId', { deviceId: vo.device_id })
      .getOne() as DeviceNoEntity;

    if (!isEmpty(dbEntity)) {
      return this.responseSuccess(this.buildRspDto(dbEntity))
    }

    // 插入新设备
    const entity = new DeviceNoEntity()
    entity.deviceId = vo.device_id
    entity.ts = curTs()
    entity.installChannel = vo.install_channel
    const insertResult = await repository.createQueryBuilder().insert().into(DeviceNoEntity).values(entity).execute()

    if (isEmpty(insertResult.identifiers)) {
      return this.responseFailed('init faild')
    }

    const obj = insertResult.identifiers[0]
    entity.id = obj.id
    return this.responseSuccess(this.buildRspDto(entity))

  }

  buildRspDto(entity: DeviceNoEntity): InitRspDto {
    const rspDto = new InitRspDto()
    rspDto.create_time = entity.ts.toString()
    rspDto.device_id = entity.deviceId
    rspDto.device_no = entity.id
    rspDto.install_channel = entity.installChannel
    return rspDto
  }
}
