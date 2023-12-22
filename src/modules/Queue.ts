// program to implement a queue data structure
class Queue<T> {
  queue: Array<T> = [];
  constructor() {
    this.queue = [];
  }

  enqueue(element: T) {
    // add element
    return this.queue.push(element);
  }

  dequeue() {
    if (this.queue.length > 0) {
      return this.queue.shift(); // remove first element
    }
  }

  peek() {
    return this.queue[this.queue.length - 1];
  }

  size() {
    return this.queue.length;
  }

  isEmpty() {
    return this.queue.length == 0;
  }

  clear() {
    this.queue = [];
  }
}

export default Queue;
