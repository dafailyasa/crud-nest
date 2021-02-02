export class LoginDTO {
  email: string;
  password: string;
}

export class RegisterDTO extends LoginDTO {
  username: string;
}

export class UpdateUserDTO {
  email: string;
  bio: string;
  image: string;
}

export interface AuthPayload {
  username: string
}