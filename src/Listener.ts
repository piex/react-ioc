import BehaviorSubject from './reactivex/BehaviorSubject';
import Subject from './reactivex/Subject';
import subjects from './subjects';

export const Listener = (target: any, key: string) => {
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
