import { BehaviorSubject, Subject } from 'rxjs';

import subjects from './subjects';

export const Listener = (target, key) => {
  const name = target.constructor.name;

  if (!subjects.get(name)) {
    const bs$ = new BehaviorSubject({});
    subjects.set(name, bs$);
  }

  const bs$ = subjects.get(name);
  const keySub$ = new Subject();

  const bs$$ = bs$.subscribe(v => {
    function update(...args) {
      keySub$.next(...args);
    }
    bs$.next(Object.assign({}, v, { [key]: update }));
  });

  bs$$.unsubscribe();

  const get = function() {
    return keySub$;
  };

  const set = () => {
    console.log(`can note set listen: ${key}, it's readonly.`);
  };

  return {
    get,
    set,
    enumerable: false,
    configurable: true,
  };
};
