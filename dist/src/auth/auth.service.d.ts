import { SignUpDto } from "./dto/signUp.dto";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";
import { PasswordService } from "../common/password/password.service";
export declare class AuthService {
    private readonly userService;
    private readonly passwordService;
    constructor(userService: UsersService, passwordService: PasswordService);
    signUp(payload: SignUpDto): Promise<{
        messate: string;
    }>;
    login(payload: LoginDto): string;
    logout(): string;
}
