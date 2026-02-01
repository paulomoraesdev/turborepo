import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { IOrder, IUser } from '@turborepo/dtos';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@CurrentUser() user: IUser): IOrder[] {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: IUser): IOrder {
    return this.ordersService.findOne(id, user);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: IUser,
  ): IOrder {
    return this.ordersService.create(createOrderDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: IUser,
  ): IOrder {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: IUser): void {
    this.ordersService.remove(id, user);
  }
}
