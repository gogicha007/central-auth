import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignUpDto } from "./dto/sitnUp.dto";

@Injectable()
export class AuthService {
    signUp(payload: SignUpDto){
        return `signup payload ${payload}`
    }
}