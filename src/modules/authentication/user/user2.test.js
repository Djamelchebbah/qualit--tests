// src/modules/authentication/user/user.test.js
import { vi, describe, it, expect, afterEach } from "vitest";
import { createUser } from "./user.service";
import * as userRepository from "./user.repository";

vi.mock("./user.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createUserInRepository: vi.fn(),
}));

describe("User Service", () => {
  it("should create an user with mock 1", async () => {
    const userData = {
      name: "Valentin R",
      birthday: new Date("1997-09-13T00:00:00Z"),
    };
    const mockUser = {
      id: 1,
      name: "Valentin R",
      birthday: new Date("1997-09-13T00:00:00Z"),
    };

    userRepository.createUserInRepository.mockResolvedValue(mockUser);

    const result = await createUser(userData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.id).toBeTypeOf("number");
    expect(result).toHaveProperty("name", "Valentin R");
    expect(result.birthday).toBeDefined();
    expect(result.birthday.getFullYear()).toBe(1997);
    expect(result.birthday.getMonth()).toBe(8);
    expect(userRepository.createUserInRepository).toHaveBeenCalledTimes(1);
    expect(userRepository.createUserInRepository).toHaveBeenCalledWith(userData);
  });

  it("should create an user with fixed id 4 using mock 2", async () => {
    const userData = {
      name: "Valentin R",
      birthday: new Date("1997-09-13T00:00:00Z"),
    };
    const expectedUser = {
      id: 4,
      name: "Valentin R",
      birthday: new Date("1997-09-13T00:00:00Z"),
    };

    userRepository.createUserInRepository.mockImplementation((data) => ({
      id: 4,
      name: data.name,
      birthday: data.birthday,
    }));

    const result = await createUser(userData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.id).toBeTypeOf("number");
    expect(result).toHaveProperty("name", "Valentin R");
    expect(result.birthday).toBeDefined();
    expect(result.birthday.getFullYear()).toBe(1997);
    expect(result.birthday.getMonth()).toBe(8);
    expect(userRepository.createUserInRepository).toHaveBeenCalledTimes(1);
    expect(userRepository.createUserInRepository).toHaveBeenCalledWith(userData);
  });

  it("should trigger a bad request error when user creation", async () => {
    const invalidUserData = {
      name: "Valentin R",
    };

    userRepository.createUserInRepository.mockReset();

    try {
      await createUser(invalidUserData);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
      expect(e.statusCode).toBe(400);
    }

    expect(userRepository.createUserInRepository).not.toHaveBeenCalled();
  });

  it("should trigger error on user creation for too young user", async () => {
    const invalidUserData = {
      name: "Valentin R",
      birthday: new Date("2010-09-13T00:00:00Z"), // 15 ans en 2025
    };

    userRepository.createUserInRepository.mockReset();

    await expect(createUser(invalidUserData)).rejects.toThrow("User is too young");

    expect(userRepository.createUserInRepository).not.toHaveBeenCalled();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});