export class LoginDTO {
  email: string;
  password: string;
}

export class RegisterDTO extends LoginDTO {
  username: string;
}

export interface AuthPayload {
  username: string
}