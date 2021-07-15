import { RouterContext, bcrypt, Status } from "../deps.ts";
import { User } from "../models/user.ts";
import { UserRepository } from "../repositories/user.repository.ts";
import { JwtService } from "../service/jwt.service.ts";

export const Register = async ({request, response}: RouterContext) => {
  const body = await request.body().value;
  const user = new User();

  user.first_name = body.first_name;
  user.last_name = body.last_name;
  user.email = body.email;
  user.password = await bcrypt.hash(body.password);

  const userRepository = new UserRepository();
  await userRepository.create(user);

  response.body = "created";
}

export const Login = async ({request, response, cookies}: RouterContext) => {
  const {email, password } = await request.body().value;

  const userRepository = new UserRepository
  const [user, error] = await userRepository.findByEmail(email);
  console.log(user, error);

  if (error) {
    response.status = Status.BadRequest;
    response.body = {
      message: error
    }
    return
  }

  if (!user) {
    response.status = Status.BadRequest;
    response.body = {
      message: "User not found"
    }
    return
  }

  if (!bcrypt.compareSync(password, user.password)) {
    response.status = Status.Unauthorized;
    response.body = {
      message: "Unauthorized"
    }
    return
  }

  const jwtService = new JwtService();
  const jwt = await jwtService.create(user.id);

  cookies.set('jwt', jwt, {httpOnly: true});

  response.status = Status.OK;
  response.body = {
    jwt
  }
}

export const Authenticate = async ({ response, cookies }: RouterContext) => {
  const jwtService = new JwtService();
  const [payload, error] = await jwtService.verify(cookies.get('jwt') || '');
  if (error) {
    response.status = Status.Unauthorized;
    response.body = {
      message: "Unauthorized"
    }
    return
  }

  response.status = Status.OK;
  response.body = {
    payload
  }
}
