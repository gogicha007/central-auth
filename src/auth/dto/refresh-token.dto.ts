import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(8192)
    refreshToken!: string;
}