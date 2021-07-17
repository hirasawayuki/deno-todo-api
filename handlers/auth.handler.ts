import { bcrypt, RouterContext, Status } from "../deps.ts";
import { User } from "../models/user.ts";
import { UserRepository } from "../repositories/user.repository.ts";
import { JwtService } from "../service/jwt.service.ts";

export class AuthHandler {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup({ request, response }: RouterContext): Promise<void> {
    const body = await request.body().value;
    const user = new User();

    user.first_name = body.first_name;
    user.last_name = body.last_name;
    user.email = body.email;
    user.password = await bcrypt.hash(body.password);

    await this.userRepository.create(user);

    response.body = "created";
  }

  async login({ request, response, cookies }: RouterContext): Promise<void> {
    const { email, password } = await request.body().value;

    const [user, error] = await this.userRepository.findByEmail(email);
    console.log(user, error);

    if (error) {
      response.status = Status.BadRequest;
      response.body = {
        message: error,
      };
      return;
    }

    if (!user) {
      response.status = Status.BadRequest;
      response.body = {
        message: "User not found",
      };
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      response.status = Status.Unauthorized;
      response.body = {
        message: "Unauthorized",
      };
      return;
    }

    const jwt = await this.jwtService.create(user.id);

    cookies.set("jwt", jwt, { httpOnly: true });

    response.status = Status.OK;
    response.body = {
      jwt,
    };
  }

  logout({ response, cookies }: RouterContext): void {
    cookies.delete("jwt");
    response.status = Status.OK;
    response.body = {
      message: "logout success",
    };
  }
}
