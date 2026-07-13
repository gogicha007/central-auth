import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/sitnUp.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): string;
    login(loginDto: LoginDto): string;
    refresh(): string;
    logout(): string;
    sessinsRevoke(): string;
    sessions(): string;
    orgainzations(): string;
    orgInvitacions(): string;
    invitacionAccept(): string;
    membershipRoles(): string;
}
