import { SignUpDto } from "./dto/signUp.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    signUp(payload: SignUpDto): string;
    login(payload: LoginDto): string;
    logout(): string;
}
