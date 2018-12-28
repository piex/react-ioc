import React, { Component, createContext } from 'react';
import ioc from './ioc';
import subjects from './subjects';

export const Provider = (name: string) => {
  if (typeof ioc.get(name) !== 'undefined') {
    throw new Error(`${name} is already regist.`);
  }

  const Context = createContext({});
  ioc.register(name, Context);

  return Cmpt => {
    return class Regist extends Component<any> {
      public state = {
        context: {},
      };

      public componentDidMount() {
        const subject$ = subjects.get(Cmpt.name);
        subject$.subscribe(data => {
          this.setState({
            context: data,
          });
        });
      }

      public render() {
        return (
          <Context.Provider value={this.state.context}>
            <Cmpt {...this.props} />
          </Context.Provider>
        );
      }
    };
  };
};
