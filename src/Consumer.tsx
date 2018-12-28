import React, { Component } from 'react';
import ioc from './ioc';

export const Consumer = (name: string, dependencies?: string[]) => {
  return Cmpt => {
    return class Instance extends Component<any> {
      public renderContext = context => {
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

      public render() {
        const Context = ioc.get(name);

        if (Context) {
          return <Context.Consumer>{this.renderContext}</Context.Consumer>;
        }

        return null;
      }
    };
  };
};
