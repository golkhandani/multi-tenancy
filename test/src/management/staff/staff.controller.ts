import { Controller, Get } from '@nestjs/common';

@Controller('staff')
export class StaffController {
    constructor() { }

    @Get()
    async get() {
        return "get"
    }
}