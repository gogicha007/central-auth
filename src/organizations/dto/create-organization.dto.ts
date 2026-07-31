import { IsString } from "class-validator"

export class CreateOrganizationDto {
    @IsString({ message: 'Organization name to be string' })
    name!: string

    @IsString({ message: 'Organization slug to be string' })
    slug!: string

    @IsString()
    taxNo!: string
}
