import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InputService } from './service/input.service'
import { InputController } from './controller/input.controller'

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [InputController],
  providers: [InputService],
  exports: [InputService]
})
export class InputModule {}
