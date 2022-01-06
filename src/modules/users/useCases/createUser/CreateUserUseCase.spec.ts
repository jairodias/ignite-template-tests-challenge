import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

describe("CreateUserUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(
            usersRepositoryInMemory
        );
    })

    it("should be able create user.", async () => {
        const user = await createUserUseCase.execute({
            email: "valid@email.com",
            name: "valid_name",
            password: "valid_password"
        });

        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("password");
    });

    it("should not be able create user if email already exists.", async () => {
        const user = await createUserUseCase.execute({
            email: "valid@email.com",
            name: "valid_name",
            password: "valid_password"
        });

        await expect(createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password
        })).rejects.toBeInstanceOf(CreateUserError)
    });
})