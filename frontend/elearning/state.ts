import { atom } from "recoil"
import { defaultUserLogin, UserLoginDto } from "./app/dtos/user.dto"

export const userLoginState = atom<UserLoginDto>({
    key: 'userLoginState',
    default: defaultUserLogin
})