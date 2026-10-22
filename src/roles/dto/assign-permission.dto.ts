import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AssignPermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  permissionId!: string;
}
