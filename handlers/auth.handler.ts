import { bcrypt, RouterContext, Status } from "../deps.ts";
import { User } from "../models/user.ts";
import { UserRepository } from "../repositories/user.repository.ts";
import { JwtUtil } from "../utils/jwt.ts";

export class AuthHandler {
  constructor(
    private userRepository: UserRepository,
    private jwtUtil: JwtUtil,
  ) {}

  async signup({ request, response }: RouterContext): Promise<void> {
    const body = await request.body().value;
    const user = new User();

    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.email = body.email;
    user.password = await bcrypt.hash(body.password);

    const result = await this.userRepository.create(user);
    if (!result) {
      response.status = Status.BadRequest;
      response.body = {
        error: "user registration has failed",
      };
    }

    response.status = Status.OK;
    response.body = "signup successful";
  }

  async login({ request, response, cookies }: RouterContext): Promise<void> {
    const { email, password } = await request.body().value;

    const [user, error] = await this.userRepository.findByEmail(email);
    console.log(user, error);

    if (error) {
      response.status = Status.BadRequest;
      response.body = {
        error: "the authentication information is incorrect",
      };
      console.log(error);
      return;
    }

    if (!user) {
      response.status = Status.BadRequest;
      response.body = {
        error: "the authentication information is incorrect",
      };
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      response.status = Status.Unauthorized;
      response.body = {
        error: "the authentication information is incorrect",
      };
      return;
    }

    const jwt = await this.jwtUtil.create(user.id);

    cookies.set("jwt", jwt, { httpOnly: true });

    response.status = Status.OK;
    response.body = {
      message: "login successful",
    };
  }

  logout({ response, cookies }: RouterContext): void {
    cookies.delete("jwt");
    response.status = Status.OK;
    response.body = {
      message: "logout successful",
    };
  }
}
