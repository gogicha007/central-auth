import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signUp.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        messate: string;
    }>;
    login(loginDto: LoginDto): string;
    refresh(): string;
    logout(): string;
    sessinsRevoke(): string;
    sessions(): string;
    orgainzations(): string;
    orgInvitacions(): string;
    invitacionAccept(): string;
    membershipRoles(): string;
    health(): string;
}
