import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository

let getBalanceUseCase: GetBalanceUseCase;


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("GetBalanceUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();

        getBalanceUseCase = new GetBalanceUseCase(
            statementsRepositoryInMemory,
            usersRepositoryInMemory
        );
    })

    it("should not be able list balance if user not exists.", async () => {
        await expect(getBalanceUseCase.execute({
            user_id: "invalid_user_id"
        })).rejects.toBeInstanceOf(GetBalanceError)
    })

    it("should be able list balance if user exists.", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "valid_name",
            email: "valid@email.com",
            password: "valid_password"
        });

        const balance = await getBalanceUseCase.execute({
            user_id: user.id
        });

        expect(balance).toHaveProperty("statement");
        expect(balance).toHaveProperty("balance");
        expect(balance.balance).toBe(0)
    })
})