import React, { Component, createContext } from 'react';
import ioc from './ioc';
import subjects from './subjects';

export const Provider = name => {
  if (typeof ioc.get(name) !== 'undefined') {
    throw new Error(`${name} 已被注册！`);
  }

  const Context = createContext({});
  ioc.register(name, Context);

  return Cmpt => {
    return class Regist extends Component {
      state = {
        context: {},
      };

      componentDidMount() {
        subjects.get(Cmpt.name).subscribe(data => {
          this.setState({
            context: data,
          });
        });
      }

      render() {
        return (
          <Context.Provider value={this.state.context}>
            <Cmpt {...this.props} />
          </Context.Provider>
        );
      }
    };
  };
};
