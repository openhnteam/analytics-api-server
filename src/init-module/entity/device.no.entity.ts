import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DeviceNoEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'varchar', length: 64 })
    deviceId: string;

    @Column({ nullable: false, type: 'varchar', length: 32 })
    installChannel: string;

    @Column({
        nullable: false,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createTime: Date;

    @Column({ default: 0 })
    ts: number
}
  