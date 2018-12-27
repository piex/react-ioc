import React, { Component } from 'react';
import ioc from './ioc';

export const Consumer = (name, dependencies) => {
  return Cmpt => {
    return class Ins extends Component {
      renderContext = context => {
        let props = {};

        if (dependencies) {
          dependencies.forEach(key => {
            props[key] = context[key];
          });
        } else {
          props = context;
        }

        return <Cmpt {...props} />;
      };

      render() {
        const Context = ioc.get(name);

        if (Context) {
          return <Context.Consumer>{this.renderContext}</Context.Consumer>;
        }

        return null;
      }
    };
  };
};
