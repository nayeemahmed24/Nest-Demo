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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import DBUser from './entities/user.entity';
import { QueryUserDTO } from './dto/query-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    console.log('Create User Controller.');
    const userId = randomUUID(); // we will get it from jwt token after implement login
    createUserDto.createdBy = userId;
    return this.userService.create(createUserDto);
  }

  @Get('/getUserAll')
  findAll(
    @Query('username') username: boolean,
    @Query('fullname') fullname: string,
    @Query('phoneNumber') phoneNumber: string,
    @Query('gender') gender: string,
    @Query('is-and') isAnd: boolean,
    @Query('page-size') pageSize,
    @Query('page-number') pageNumber
  ) {

    const query: QueryUserDTO = {
        username: username,
        fullname: fullname,
        phoneNumber: phoneNumber,
        gender: gender,
        isAnd: isAnd,
        pageNumber: pageNumber,
        pageSize: pageSize
    };

    return this.userService.findAll(query);
  }

  @Get('/getUser/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = randomUUID(); // we will get it from jwt token after implement login
    updateUserDto.updateBy = userId;
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Delete('/delete-parmanent/:id')
  removeParmanent(@Param('id') id: string) {
    return this.userService.removeParmanently(id);
  }
}
