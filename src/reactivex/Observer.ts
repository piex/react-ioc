export interface IDestination<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export default class Observer<T> {
  public destination: IDestination<T>;
  private isStopped = false;

  constructor(destinationOrNext: (args: any) => void) {
    this.destination = this.safeObserver(destinationOrNext);
  }

  public safeObserver(observerOrNext: (value: T) => void): IDestination<T> {
    return {
      next: observerOrNext,
    };
  }

  public next(args: T) {
    if (!this.isStopped && this.next) {
      try {
        this.destination.next(args); // send next
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
    }
  }

  public error(err) {
    if (!this.isStopped && this.error) {
      try {
        this.destination.error(err); // send error
      } catch (anotherError) {
        this.unsubscribe();
        throw anotherError;
      }
      this.unsubscribe();
    }
  }

  public complete() {
    if (!this.isStopped && this.complete) {
      // 先判斷是否停止過
      try {
        this.destination.complete(); // send complete
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
      this.unsubscribe(); // unsubscribe after send complete
    }
  }

  public unsubscribe() {
    this.isStopped = true;
  }
}
