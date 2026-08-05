import { IsEmail } from "class-validator";
import { RoleNames } from "@prisma/client";
import { UserValidators } from "../../common/validators/user.validators";

export class SendInvitationRequestDto {
    organizationId!: string;

    @IsEmail({}, UserValidators.EMAIL_RULES)
    email!: string;

    roleName!: RoleNames

    createdByUserId!: string;
}