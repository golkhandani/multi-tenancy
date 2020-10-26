import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';

@Module({
    controllers: [StaffController],
    providers: [],
})
export class StaffModule { };