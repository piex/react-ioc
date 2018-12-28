import Subject from './reactivex/Subject';

export interface ISubjects {
  data: { [key: string]: Subject<any> };
  get(registName: string): Subject<any>;
  set(registName: string, subject: Subject<any>): void;
}

const subjects: ISubjects = {
  data: {},

  get(registName: string) {
    return this.data[registName];
  },

  set(registName: string, subject: Subject<any>) {
    if (typeof this.data[registName] !== 'undefined') {
      throw new Error(`${registName} is already exists.`);
    } else {
      this.data[registName] = subject;
    }
  },
};

export default subjects;
