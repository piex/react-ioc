import Subject from './Subject';

export default class BehaviorSubject<T> extends Subject<T> {
  constructor(private store: T) {
    super();
  }

  get value(): T {
    return this.getValue();
  }

  public getValue(): T {
    if (this.closed) {
      throw new Error('subject has been closed.');
    } else {
      return this.store;
    }
  }

  public next(value: T): void {
    this.store = value;
    super.next(value);
  }

  public subscribe(observerOrNext: (args: T) => void) {
    const observer = super.subscribe(observerOrNext);
    observer.next(this.store);
    return observer;
  }
}
