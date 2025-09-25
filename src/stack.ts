export class Stack<T> {
    private items: T[] = [];
    public size = 0;
  
    constructor() {}
  
    public get empty() {
      return this.size === 0;
    }
  
    public push(value: T) {
      this.items.push(value);
      this.size += 1;
    }
  
    public pop(): T | undefined {
      if (this.empty) {
        return undefined;
      }
      this.size -= 1;
      return this.items.pop();
    }
  }