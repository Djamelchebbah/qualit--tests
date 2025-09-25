// src/modules/banking/account/account.service.js
import { z } from "zod";
import { HttpBadRequest, HttpNotFound } from "@httpx/exception";
import { createAccountInRepository, getAccountsInRepository, deleteAccountInRepository } from "./account.repository";

const accountSchema = z.object({
  userId: z.number().int().positive(),
  amount: z.number().nonnegative(),
});

export const createAccount = async (accountData) => {
  const result = accountSchema.safeParse(accountData);
  if (!result.success) {
    throw new HttpBadRequest(result.error.message);
  }
  return createAccountInRepository(result.data);
};

export const getAccounts = async (userId) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new HttpBadRequest("Invalid userId");
  }
  return getAccountsInRepository(userId);
};

export const deleteAccount = async (userId, accountId) => {
  if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(accountId) || accountId <= 0) {
    throw new HttpBadRequest("Invalid userId or accountId");
  }
  const result = await deleteAccountInRepository(userId, accountId);
  if (!result.success) {
    throw new HttpNotFound("Account not found");
  }
  return result;
};