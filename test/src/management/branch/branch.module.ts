import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';

@Module({
    controllers: [BranchController],
    providers: [],
})
export class BranchModule { };