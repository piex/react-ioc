import Subject from './Subject';

describe('Subject', () => {
  it('should pump values right on through itself', () => {
    const subject$ = new Subject();
    const expected = ['foo', 'bar'];

    subject$.subscribe((x: string) => {
      expect(x).toBe(expected.shift());
    });

    subject$.next('foo');
    subject$.next('bar');
  });

  it('should pump values to multiple subscribers', () => {
    const subject$ = new Subject<string>();
    const expected = ['foo', 'bar'];

    let i = 0;
    let j = 0;

    subject$.subscribe(x => {
      expect(x).toBe(expected[i++]);
    });

    subject$.subscribe(x => {
      expect(x).toBe(expected[j++]);
    });

    subject$.next('foo');
    subject$.next('bar');
  });
});
