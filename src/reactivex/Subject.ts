import Observer from './Observer';

export default class Subject<T> {
  public closed = false;

  private observers: Array<Observer<T>> = [];

  public next(args?: T) {
    if (!this.closed) {
      this.observers.forEach(observer => observer.next(args));
    }
  }

  public subscribe(observerOrNext: (args: T) => void) {
    const observer = new Observer<T>(observerOrNext);
    this.observers.push(observer);
    return observer;
  }

  public unsubscribe() {
    this.closed = true;
  }
}
