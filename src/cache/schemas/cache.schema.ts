import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CacheDocument = Cache & Document;

@Schema()
export class Cache {
    @ApiProperty()
    @Prop() key: string;
    
    @ApiProperty()
    @Prop() data: string;

    @ApiProperty()
    @Prop() ttl: number;
}

export const CacheSchema = SchemaFactory.createForClass(Cache);
