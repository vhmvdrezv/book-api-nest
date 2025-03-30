import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateOrderDto {

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}