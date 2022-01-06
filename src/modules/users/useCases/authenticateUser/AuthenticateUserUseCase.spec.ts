import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

let authenticateUserUseCase: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
    })

    it("should be able authenticate user", async () => {
        const user = await createUserUseCase.execute({
            email: "valid@email.com",
            name: "valid_name",
            password: "valid_password"
        });

        const authenticate = await authenticateUserUseCase.execute({
            email: user.email,
            password: "valid_password"
        });

        expect(authenticate).toHaveProperty("token");
    });

    it("should not be able authenticate user if email is incorrect.", async () => {
        await expect(authenticateUserUseCase.execute({
            email: "invalid@email.com",
            password: "valid_password"
        })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    });

    it("should not be able authenticate user if password is incorrect.", async () => {
        const user = await createUserUseCase.execute({
            email: "valid@email.com",
            name: "valid_name",
            password: "valid_password"
        });

        await expect(authenticateUserUseCase.execute({
            email: user.email,
            password: "invalid_password"
        })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    });
})