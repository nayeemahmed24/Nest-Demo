import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    public username: string;

    @ApiProperty()
    @IsNotEmpty()
    public fullname: string;

    @ApiProperty()
    @IsNotEmpty()
    public email: string;

    @ApiProperty()
    @IsNotEmpty()
    public dateOfBirth: string;

    @ApiProperty()
    @IsNotEmpty()
    public phoneNumber: string;

    @ApiProperty()
    public address: string;

    @ApiProperty()
    public country: string;

    @ApiProperty()
    @IsNotEmpty()
    public gender: string;

    public createdBy: string;
}
