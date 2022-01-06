import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let statementsRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository

let getStatementOperationUseCase: GetStatementOperationUseCase;


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("GetStatementOperationUseCase", () => {

    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();

        getStatementOperationUseCase = new GetStatementOperationUseCase(
            usersRepositoryInMemory, 
            statementsRepositoryInMemory
        )
    })

    it("should be able list statement operation if users exists.", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "valid_name",
            email: "valid@email.com",
            password: "valid_password"
        });

        const statement = await statementsRepositoryInMemory.create({
            user_id: user.id,
            amount: 10,
            description: "valid_description",
            type: 'deposit' as OperationType
        });

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id,
            statement_id: statement.id
        });

        expect(statementOperation).toHaveProperty("id");
        expect(statementOperation).toHaveProperty("user_id");
        expect(statementOperation).toHaveProperty("amount");
        expect(statementOperation).toHaveProperty("description");
        expect(statementOperation).toHaveProperty("type");


        expect(statementOperation.id).toBe(statement.id);
        expect(statementOperation.user_id).toBe(user.id);
        expect(statementOperation.amount).toBe(statement.amount);
        expect(statementOperation.description).toBe(statement.description);
        expect(statementOperation.type).toBe(statement.type);
    });


    it("should not be able list statement operation if users not exists.", async () => {
        await expect(getStatementOperationUseCase.execute({
            user_id: "invalid_user_id",
            statement_id: "valid_statement_id"
        })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    });

    it("should not be able list statement operation if statement not exists.", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "valid_name",
            email: "valid@email.com",
            password: "valid_password"
        });

        await expect(getStatementOperationUseCase.execute({
            user_id: user.id,
            statement_id: "invalid_statement_id"
        })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    });
})