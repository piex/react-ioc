'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var tslib_1 = require('tslib');
var React = require('react');
var React__default = _interopDefault(React);
var rxjs = require('rxjs');

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
  var Context = React.createContext({});
  ioc.register(name, Context);
  return function(Cmpt) {
    return /** @class */ (function(_super) {
      tslib_1.__extends(Regist, _super);
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
        return React__default.createElement(
          Context.Provider,
          { value: this.state.context },
          React__default.createElement(Cmpt, tslib_1.__assign({}, this.props))
        );
      };
      return Regist;
    })(React.Component);
  };
};

var Context = function(target, key, descriptor) {
  var name = target.constructor.name;
  var value = descriptor.initializer();
  if (!subjects.get(name)) {
    var bs$_1 = new rxjs.BehaviorSubject({});
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
    var bs$_1 = new rxjs.BehaviorSubject({});
    subjects.set(name, bs$_1);
  }
  var bs$ = subjects.get(name);
  var keySub$ = new rxjs.Subject();
  var bs$$ = bs$.subscribe(function(v) {
    var _a;
    function update() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      keySub$.next.apply(keySub$, args);
    }
    if (typeof v[key] === 'undefined') {
      bs$.next(Object.assign({}, v, ((_a = {}), (_a[key] = update), _a)));
    }
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
      tslib_1.__extends(Ins, _super);
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
          return React__default.createElement(Cmpt, tslib_1.__assign({}, props));
        };
        return _this;
      }
      Ins.prototype.render = function() {
        var Context = ioc.get(name);
        if (Context) {
          return React__default.createElement(Context.Consumer, null, this.renderContext);
        }
        return null;
      };
      return Ins;
    })(React.Component);
  };
};

exports.Provider = Provider;
exports.Context = Context;
exports.Listener = Listener;
exports.Consumer = Consumer;
//# sourceMappingURL=index.js.map
