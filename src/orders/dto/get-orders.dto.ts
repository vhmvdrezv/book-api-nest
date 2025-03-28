import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class GetOrdersDto {

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number;

}