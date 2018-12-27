import { __extends, __assign } from 'tslib';
import React, { createContext, Component } from 'react';
import { BehaviorSubject, Subject } from 'rxjs';

var ioc = {
  data: {},
  get: function(key) {
    return this.data[key];
  },
  register: function(key, value) {
    this.data[key] = value;
  },
};

var subjects = {
  data: {},
  get: function(className) {
    return this.data[className];
  },
  set: function(className, value) {
    if (typeof this.data[className] != 'undefined') {
      throw new Error(className + ' is already exists.');
    } else {
      this.data[className] = value;
    }
  },
};

var Provider = function(name) {
  if (typeof ioc.get(name) !== 'undefined') {
    throw new Error(name + ' \u5DF2\u88AB\u6CE8\u518C\uFF01');
  }
  var Context = createContext({});
  ioc.register(name, Context);
  return function(Cmpt) {
    return /** @class */ (function(_super) {
      __extends(Regist, _super);
      function Regist() {
        var _this = (_super !== null && _super.apply(this, arguments)) || this;
        _this.state = {
          context: {},
        };
        return _this;
      }
      Regist.prototype.componentDidMount = function() {
        var _this = this;
        subjects.get(Cmpt.name).subscribe(function(data) {
          _this.setState({
            context: data,
          });
        });
      };
      Regist.prototype.render = function() {
        return React.createElement(
          Context.Provider,
          { value: this.state.context },
          React.createElement(Cmpt, __assign({}, this.props))
        );
      };
      return Regist;
    })(Component);
  };
};

var Context = function(target, key, descriptor) {
  var name = target.constructor.name;
  var value = descriptor.initializer();
  if (!subjects.get(name)) {
    var bs$_1 = new BehaviorSubject({});
    subjects.set(name, bs$_1);
  }
  var bs$ = subjects.get(name);
  function update(value) {
    var context$$ = bs$.subscribe(function(v) {
      var _a;
      if (v[key] !== value) {
        bs$.next(Object.assign({}, v, ((_a = {}), (_a[key] = value), _a)));
      }
    });
    context$$.unsubscribe();
  }
  // init context
  update(value);
  var get = function() {
    return value;
  };
  var set = function(newVal) {
    update(newVal);
    value = newVal;
  };
  return {
    get: get,
    set: set,
    enumerable: false,
    configurable: true,
  };
};

var Listener = function(target, key) {
  var name = target.constructor.name;
  if (!subjects.get(name)) {
    var bs$_1 = new BehaviorSubject({});
    subjects.set(name, bs$_1);
  }
  var bs$ = subjects.get(name);
  var keySub$ = new Subject();
  var bs$$ = bs$.subscribe(function(v) {
    var _a;
    function update() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      keySub$.next.apply(keySub$, args);
    }
    bs$.next(Object.assign({}, v, ((_a = {}), (_a[key] = update), _a)));
  });
  bs$$.unsubscribe();
  var get = function() {
    return keySub$;
  };
  var set = function() {
    console.log('can note set listen: ' + key + ", it's readonly.");
  };
  return {
    get: get,
    set: set,
    enumerable: false,
    configurable: true,
  };
};

var Consumer = function(name, dependencies) {
  return function(Cmpt) {
    return /** @class */ (function(_super) {
      __extends(Ins, _super);
      function Ins() {
        var _this = (_super !== null && _super.apply(this, arguments)) || this;
        _this.renderContext = function(context) {
          var props = {};
          if (dependencies) {
            dependencies.forEach(function(key) {
              props[key] = context[key];
            });
          } else {
            props = context;
          }
          return React.createElement(Cmpt, __assign({}, props));
        };
        return _this;
      }
      Ins.prototype.render = function() {
        var Context = ioc.get(name);
        if (Context) {
          return React.createElement(Context.Consumer, null, this.renderContext);
        }
        return null;
      };
      return Ins;
    })(Component);
  };
};

export { Provider, Context, Listener, Consumer };
//# sourceMappingURL=index.esm.js.map
