import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignUpDto } from "./dto/signUp.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    signUp(payload: SignUpDto){
        return `signup payload ${JSON.stringify(payload)}`
    }

    login(payload: LoginDto){
        return `login payload ${JSON.stringify(payload)}`
    }

    logout(){
        return `logout hit`
    }

}