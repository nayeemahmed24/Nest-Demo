import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDTO } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import DBUser from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(DBUser) private userRepository: Repository<DBUser>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = UserService.getUserFromDto(createUserDto);
    const response = await this.userRepository.save(user);
    return response;
  }

  async findAll(query: QueryUserDTO) {
    const queryString: string = UserService.getSqlQuery(query);
    let users: DBUser[] = await this.userRepository.query(queryString);
    const count = users.length;
    if (query.pageNumber && query.pageSize) {
      const start: number = (+query.pageNumber - 1) * +query.pageSize;
      users = users.slice(start, +query.pageSize + start);
    }
    return { data: users, totalCount: count };
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser: DBUser = await this.findOne(id);
    if (existingUser) {
      const updatedUser = UserService.getUpdatedUserFromDto(
        updateUserDto,
        existingUser,
      );
      const response = await this.userRepository.update(id, updatedUser);
      return response;
    }
    return 'user not found';
  }

  async remove(id: string) {
    await this.userRepository.softDelete(id);
  }

  async removeParmanently(id: string) {
    await this.userRepository.delete(id);
  }

  static getUserFromDto(createUserDto: CreateUserDto) {
    const user = new DBUser();
    user.username = createUserDto.username;
    user.address = createUserDto.address;
    user.country = createUserDto.country;
    user.createdBy = createUserDto.createdBy;
    user.dateOfBirth = createUserDto.dateOfBirth;
    user.email = createUserDto.email;
    user.fullname = createUserDto.fullname;
    user.gender = createUserDto.gender;
    user.phoneNumber = createUserDto.phoneNumber;
    return user;
  }

  static getUpdatedUserFromDto(updateUserDto: UpdateUserDto, user: DBUser) {
    user.username = updateUserDto.username
      ? updateUserDto.username
      : user.username;
    user.address = updateUserDto.address ? updateUserDto.address : user.address;
    user.country = updateUserDto.country ? updateUserDto.country : user.country;
    user.createdBy = user.createdBy;
    user.creationDate = user.creationDate;
    user.dateOfBirth = updateUserDto.dateOfBirth
      ? updateUserDto.dateOfBirth
      : user.dateOfBirth;
    user.email = updateUserDto.email ? updateUserDto.email : user.email;
    user.fullname = updateUserDto.fullname
      ? updateUserDto.fullname
      : user.fullname;
    user.gender = updateUserDto.gender ? updateUserDto.gender : user.gender;
    user.phoneNumber = updateUserDto.phoneNumber
      ? updateUserDto.phoneNumber
      : user.phoneNumber;
    user.lastUpdateDate = new Date().toUTCString();
    user.lastUpdatedBy = updateUserDto.updateBy;
    return user;
  }

  static getSqlQuery(query: QueryUserDTO) {
    if(!query.fullname && !query.gender && !query.phoneNumber && !query.username){
        return `SELECT * from users`;
    }
    const logic: string = query.isAnd === true ? 'AND' : 'OR';
    let queryString = `SELECT * from users where ${
      query.username ? `username='${query.username}' ${logic}` : ''
    } ${
      query.phoneNumber ? `phone_number='${query.phoneNumber}' ${logic}` : ''
    }${query.fullname ? `fullname='${query.fullname}'${logic}` : ''} ${
      query.gender ? `gender='${query.gender}' ${logic}` : ''
    }`;
    const index= queryString.lastIndexOf(logic);
    queryString = queryString.substring(0, index - logic.length+1);
    return queryString;
  }
}
