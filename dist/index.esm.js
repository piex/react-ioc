import React, { createContext, Component } from 'react';

var ioc = {
  data: {},
  get(key) {
    return this.data[key];
  },
  register(key, value) {
    this.data[key] = value;
  },
};

const subjects = {
  data: {},
  get(registName) {
    return this.data[registName];
  },
  set(registName, subject) {
    if (typeof this.data[registName] !== 'undefined') {
      throw new Error(`${registName} is already exists.`);
    } else {
      this.data[registName] = subject;
    }
  },
};

const Provider = name => {
  if (typeof ioc.get(name) !== 'undefined') {
    throw new Error(`${name} is already regist.`);
  }
  const Context = createContext({});
  ioc.register(name, Context);
  return Cmpt => {
    return class Regist extends Component {
      constructor() {
        super(...arguments);
        this.state = {
          context: {},
        };
      }
      componentDidMount() {
        const subject$ = subjects.get(Cmpt.name);
        subject$.subscribe(data => {
          this.setState({
            context: data,
          });
        });
      }
      render() {
        return React.createElement(
          Context.Provider,
          { value: this.state.context },
          React.createElement(Cmpt, Object.assign({}, this.props))
        );
      }
    };
  };
};

class Observer {
  constructor(destinationOrNext) {
    this.isStopped = false;
    this.destination = this.safeObserver(destinationOrNext);
  }
  safeObserver(observerOrNext) {
    return {
      next: observerOrNext,
    };
  }
  next(args) {
    if (!this.isStopped && this.next) {
      try {
        this.destination.next(args); // send next
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
    }
  }
  error(err) {
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
  complete() {
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
  unsubscribe() {
    this.isStopped = true;
  }
}

class Subject {
  constructor() {
    this.closed = false;
    this.observers = [];
  }
  next(args) {
    if (!this.closed) {
      this.observers.forEach(observer => observer.next(args));
    }
  }
  subscribe(observerOrNext) {
    const observer = new Observer(observerOrNext);
    this.observers.push(observer);
    return observer;
  }
  unsubscribe() {
    this.closed = true;
  }
}

class BehaviorSubject extends Subject {
  constructor(store) {
    super();
    this.store = store;
  }
  get value() {
    return this.getValue();
  }
  getValue() {
    if (this.closed) {
      throw new Error('subject has been closed.');
    } else {
      return this.store;
    }
  }
  next(value) {
    this.store = value;
    super.next(value);
  }
  subscribe(observerOrNext) {
    const observer = super.subscribe(observerOrNext);
    observer.next(this.store);
    return observer;
  }
}

const Context = (target, key, descriptor) => {
  const name = target.constructor.name;
  let value = descriptor.initializer();
  if (!subjects.get(name)) {
    subjects.set(name, new BehaviorSubject({}));
  }
  const bs$ = subjects.get(name);
  function update(vs) {
    const context$$ = bs$.subscribe(v => {
      if (v[key] !== vs) {
        bs$.next(Object.assign({}, v, { [key]: vs }));
      }
    });
    context$$.unsubscribe();
  }
  update(value);
  const get = () => {
    return value;
  };
  const set = newVal => {
    update(newVal);
    value = newVal;
  };
  return {
    configurable: true,
    enumerable: false,
    get,
    set,
  };
};

const Listener = (target, key) => {
  const name = target.constructor.name;
  if (!subjects.get(name)) {
    subjects.set(name, new BehaviorSubject({}));
  }
  const bs$ = subjects.get(name);
  const keySub$ = new Subject();
  const bs$$ = bs$.subscribe(v => {
    function update(args) {
      keySub$.next(args);
    }
    if (typeof v[key] === 'undefined') {
      bs$.next(Object.assign({}, v, { [key]: update }));
    }
  });
  bs$$.unsubscribe();
  const get = () => {
    return keySub$;
  };
  const set = () => {
    // tslint:disable-next-line
    console.log(`can note set listen: ${key}, it's readonly.`);
  };
  return {
    configurable: true,
    enumerable: false,
    get,
    set,
  };
};

const Consumer = (name, dependencies) => {
  return Cmpt => {
    return class Instance extends Component {
      constructor() {
        super(...arguments);
        this.renderContext = context => {
          let props = {};
          if (dependencies) {
            dependencies.forEach(key => {
              props[key] = context[key];
            });
          } else {
            props = context;
          }
          return React.createElement(Cmpt, Object.assign({}, props));
        };
      }
      render() {
        const Context = ioc.get(name);
        if (Context) {
          return React.createElement(Context.Consumer, null, this.renderContext);
        }
        return null;
      }
    };
  };
};

export { Provider, Context, Listener, Consumer };
//# sourceMappingURL=index.esm.js.map
