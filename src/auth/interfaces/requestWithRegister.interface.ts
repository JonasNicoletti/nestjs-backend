import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

interface RequestWithRegister extends Request {
  user: CreateUserDto;
}

export default RequestWithRegister;
