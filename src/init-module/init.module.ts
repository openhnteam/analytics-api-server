import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InitController } from './controller/init.controller'
import { InitService } from './service/init.service'
import { DeviceNoEntity } from './entity/device.no.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DeviceNoEntity])],
  controllers: [InitController],
  providers: [InitService],
  exports: [InitService]
})
export class InitModule {}
