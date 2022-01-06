import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: IUsersRepository;
let statementsRepositoryInMemory: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("CreateStatementUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();

        createStatementUseCase = new CreateStatementUseCase(
            usersRepositoryInMemory,
            statementsRepositoryInMemory
        );
    });

    it("should be able create a statement deposit", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "valid_name",
            email: "valid@email.com",
            password: "valid_password"
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id,
            amount: 10,
            description: "valid_description",
            type: 'deposit' as OperationType
        });

        expect(statement).toHaveProperty("id");
        expect(statement).toHaveProperty("type");
        expect(statement).toHaveProperty("amount");
    });

    it("should not be able create a statement if user does not exists.", async () => {
        await expect(createStatementUseCase.execute({
            user_id: "invalid_user_id",
            amount: 10,
            description: "valid_description",
            type: 'deposit' as OperationType
        })).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    });

    it("should be able create a statement withdraw.", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "valid_name",
            email: "valid@email.com",
            password: "valid_password"
        });

        await createStatementUseCase.execute({
            user_id: user.id,
            amount: 10,
            description: "valid_description",
            type: 'deposit' as OperationType
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id,
            amount: 10,
            description: "valid_description",
            type: 'withdraw' as OperationType
        });

        expect(statement).toHaveProperty("id");
        expect(statement).toHaveProperty("type");
        expect(statement.type).toBe("withdraw");
        expect(statement).toHaveProperty("amount");
    });

    it("should not be able create a statement withdraw if insufficient funds.", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "valid_name",
            email: "valid@email.com",
            password: "valid_password"
        });

       await expect(createStatementUseCase.execute({
            user_id: user.id,
            amount: 10,
            description: "valid_description",
            type: 'withdraw' as OperationType
        })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});