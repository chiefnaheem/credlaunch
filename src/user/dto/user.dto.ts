import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class UserDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    firstName: string;
    

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiProperty()
    @IsPhoneNumber('NG')
    @IsNotEmpty()
    phoneNumber: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    dateOfBirth: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

}

export class UpdateUserDto extends PartialType(UserDto) {}
