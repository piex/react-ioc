import BehaviorSubject from './reactivex/BehaviorSubject';
import subjects from './subjects';

export const Context = (target: any, key: string, descriptor: any) => {
  const name = target.constructor.name;
  let value = descriptor.initializer();

  if (!subjects.get(name)) {
    subjects.set(name, new BehaviorSubject({}));
  }

  const bs$ = subjects.get(name);

  function update(vs: any) {
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

  const set = (newVal: any) => {
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
