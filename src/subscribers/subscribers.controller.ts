import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import {
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { UserInterface } from 'src/users/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Get()
  @ResponseMessage('Fetch list Subcriber with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a Subcriber by id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Post()
  @ResponseMessage('Create a new Subcriber')
  create(
    @User() user: UserInterface,
    @Body() subscriberDto: CreateSubscriberDto,
  ) {
    return this.subscribersService.create(user, subscriberDto);
  }

  @Post('skills')
  @ResponseMessage("Get subscriber's skills")
  @SkipCheckPermission()
  getUserSkills(@User() user: UserInterface) {
    return this.subscribersService.getSkills(user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Subcriber by id')
  remove(@Param('id') id: string, @User() user: UserInterface) {
    return this.subscribersService.remove(id, user);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Update a Subcriber by id')
  update(
    @User() user: UserInterface,
    @Body() subscriberDto: UpdateSubscriberDto,
  ) {
    return this.subscribersService.update(user, subscriberDto);
  }
}
