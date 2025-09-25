// src/modules/banking/account/account.test.js
import { vi, describe, it, expect, afterEach } from "vitest";
import { createAccount, getAccounts, deleteAccount } from "./account.service";
import * as accountRepository from "./account.repository";

vi.mock("./account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createAccountInRepository: vi.fn(),
  getAccountsInRepository: vi.fn(),
  deleteAccountInRepository: vi.fn(),
}));

describe("Account Service", () => {
  it("should create an account successfully", async () => {
    const accountData = {
      userId: 1,
      amount: 1000.0,
    };
    const mockAccount = {
      id: 1,
      userId: 1,
      amount: 1000.0,
    };

    accountRepository.createAccountInRepository.mockResolvedValue(mockAccount);

    const result = await createAccount(accountData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.id).toBeTypeOf("number");
    expect(result).toHaveProperty("userId", 1);
    expect(result).toHaveProperty("amount", 1000.0);
    expect(accountRepository.createAccountInRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.createAccountInRepository).toHaveBeenCalledWith(accountData);
  });

  it("should trigger a bad request error when creating account with invalid parameters", async () => {
    const invalidAccountData = {
      userId: 1,
      // amount manquant
    };

    accountRepository.createAccountInRepository.mockReset();

    try {
      await createAccount(invalidAccountData);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
      expect(e.statusCode).toBe(400);
    }

    expect(accountRepository.createAccountInRepository).not.toHaveBeenCalled();
  });

  it("should get accounts successfully and verify each item", async () => {
    const userId = 1;
    const mockAccounts = [
      { id: 1, userId: 1, amount: 1000.0 },
      { id: 2, userId: 1, amount: 500.0 },
    ];

    accountRepository.getAccountsInRepository.mockResolvedValue(mockAccounts);

    const result = await getAccounts(userId);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    result.forEach((account) => {
      expect(account).toHaveProperty("id");
      expect(account.id).toBeTypeOf("number");
      expect(account).toHaveProperty("userId", userId);
      expect(account).toHaveProperty("amount");
      expect(account.amount).toBeTypeOf("number");
    });
    expect(accountRepository.getAccountsInRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.getAccountsInRepository).toHaveBeenCalledWith(userId);
  });

  it("should delete an account successfully", async () => {
    const userId = 1;
    const accountId = 1;
    const mockResult = { success: true };

    accountRepository.deleteAccountInRepository.mockResolvedValue(mockResult);

    const result = await deleteAccount(userId, accountId);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("success", true);
    expect(accountRepository.deleteAccountInRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.deleteAccountInRepository).toHaveBeenCalledWith(userId, accountId);
  });

  it("should trigger an error when deleting account with invalid account id", async () => {
    const userId = 1;
    const invalidAccountId = 999;

    accountRepository.deleteAccountInRepository.mockRejectedValue(
      new Error("Account not found")
    );

    try {
      await deleteAccount(userId, invalidAccountId);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe("Account not found");
    }

    expect(accountRepository.deleteAccountInRepository).toHaveBeenCalledTimes(1);
    expect(accountRepository.deleteAccountInRepository).toHaveBeenCalledWith(userId, invalidAccountId);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});