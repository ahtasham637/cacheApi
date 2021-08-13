import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty} from 'class-validator';

export class CreateUpdateCacheDto {
    @ApiProperty()
    @IsNotEmpty() data: string;
}
