import BehaviorSubject from './BehaviorSubject';
import Subject from './Subject';

describe('BehaviorSubject', () => {
  it('should extend Subject', () => {
    const subject = new BehaviorSubject(null);
    expect(subject).toBeInstanceOf(Subject);
  });

  it('should have a getValue() method to retrieve the current value', () => {
    const subject = new BehaviorSubject('staltz');
    expect(subject.getValue()).toBe('staltz');

    subject.next('oj');

    expect(subject.getValue()).toBe('oj');
  });

  it('should start with an initialization value', () => {
    const subject$ = new BehaviorSubject('foo');
    const expected = ['foo', 'bar'];
    let i = 0;

    subject$.subscribe((x: string) => {
      expect(x).toBe(expected[i++]);
    });

    subject$.next('bar');
  });

  it('should pump values to multiple subscribers', () => {
    const subject$ = new BehaviorSubject('init');
    const expected = ['init', 'foo', 'bar'];
    let i = 0;
    let j = 0;

    subject$.subscribe((x: string) => {
      expect(x).toBe(expected[i++]);
    });

    subject$.subscribe((x: string) => {
      expect(x).toBe(expected[j++]);
    });

    subject$.next('foo');
    subject$.next('bar');
    // subject$.complete();
  });
});
