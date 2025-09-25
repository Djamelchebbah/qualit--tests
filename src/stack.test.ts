// src/stack.test.ts
import { describe, it, expect } from "vitest";
import { Stack } from "./stack";

describe("Stack", () => {
  it("should initialize an empty stack", () => {
    const stack = new Stack<number>();
    expect(stack.empty).toBe(true);
    expect(stack.size).toBe(0);
  });

  it("should push an item and update size", () => {
    const stack = new Stack<number>();
    stack.push(1);
    expect(stack.empty).toBe(false);
    expect(stack.size).toBe(1);
  });

  it("should pop an item and update size", () => {
    const stack = new Stack<number>();
    stack.push(1);
    const item = stack.pop();
    expect(item).toBe(1);
    expect(stack.empty).toBe(true);
    expect(stack.size).toBe(0);
  });

  it("should return undefined when popping an empty stack", () => {
    const stack = new Stack<number>();
    const item = stack.pop();
    expect(item).toBeUndefined();
    expect(stack.size).toBe(0);
  });
});