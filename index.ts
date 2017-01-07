export interface AwaitPromiseInvokerOptions<T> {
  callback: AwaitPromiseCallback<T>;
};

export interface AwaitPromiseCallback<T> { (value: T): Promise<void>; };

export class AwaitPromiseInvoker<T> {
  callback: AwaitPromiseCallback<T>;
  promise: Promise<void> = null;
  value: T;
  shouldInvoke: boolean = false;

  constructor(options?: AwaitPromiseInvokerOptions<T>) {
    options = Object.assign({}, {}, options);
    this.callback = options.callback;
  }

  emit(value?: T): void {
    this.value = value;
    this.shouldInvoke = true;
    if (this.promise === null) {
      this.invokeCallback();
    }
  }

  protected async invokeCallback() {
    while (this.shouldInvoke) {
      this.shouldInvoke = false;
      this.promise = this.callback(this.value);
      try {
        // ensure a valid promise was returned
        if (this.promise && (this.promise instanceof Promise)) {
          await this.promise;
        }
      } catch (e) {
        // TODO: log error?
      }
      this.promise = null;
    }
  }
}
