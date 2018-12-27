import { BehaviorSubject } from 'rxjs';
import subjects from './subjects';

export const Context = (target, key, descriptor) => {
  const name = target.constructor.name;
  let value = descriptor.initializer();

  if (!subjects.get(name)) {
    const bs$ = new BehaviorSubject({});
    subjects.set(name, bs$);
  }

  const bs$ = subjects.get(name);

  function update(value) {
    const context$$ = bs$.subscribe(v => {
      if (v[key] !== value) {
        bs$.next(Object.assign({}, v, { [key]: value }));
      }
    });
    context$$.unsubscribe();
  }

  // init context
  update(value);

  const get = function() {
    return value;
  };

  const set = newVal => {
    update(newVal);
    value = newVal;
  };

  return {
    get,
    set,
    enumerable: false,
    configurable: true,
  };
};
