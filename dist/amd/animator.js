define(['exports', 'velocity', 'velocity/velocity.ui', 'jsol', 'aurelia-templating'], function (exports, _velocity, _velocityVelocityUi, _jsol, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _Velocity = _interopRequireDefault(_velocity);

  var _JSOL = _interopRequireDefault(_jsol);

  var VelocityAnimator = (function () {
    function VelocityAnimator(container) {
      _classCallCheck(this, VelocityAnimator);

      this.options = {
        duration: 400,
        easing: 'linear'
      };
      this.isAnimating = false;
      this.enterAnimation = { properties: ':enter', options: { easing: 'ease-in', duration: 200 } };
      this.leaveAnimation = { properties: ':leave', options: { easing: 'ease-in', duration: 200 } };
      this.easings = [];
      this.effects = {
        ':enter': 'fadeIn',
        ':leave': 'fadeOut'
      };

      this.container = container || window.document;
      this.easings = Object.assign(_Velocity['default'].Easings, this.easings);
      this.effects = Object.assign(_Velocity['default'].Redirects, this.effects);
    }

    _createClass(VelocityAnimator, [{
      key: 'animate',
      value: function animate(element, nameOrProps, options, silent) {
        this.isAnimating = true;
        var _this = this;
        var overrides = {
          complete: function complete(el) {
            _this.isAnimating = false;
            if (!silent) dispatch(el, 'animateDone');
            if (options && options.complete) options.complete.apply(this, arguments);
          }
        };
        if (!element) return Promise.reject(new Error('invalid first argument'));

        if (typeof element === 'string') element = this.container.querySelectorAll(element);

        if (!element || element.length === 0) return Promise.resolve(element);

        if (!silent) dispatch(element, 'animateBegin');

        if (typeof nameOrProps === 'string') {
          nameOrProps = this.resolveEffectAlias(nameOrProps);
        }

        var opts = Object.assign({}, this.options, options, overrides);
        var p = (0, _Velocity['default'])(element, nameOrProps, opts);

        if (!p) return Promise.reject(new Error('invalid element used for animator.animate'));
        return p;
      }
    }, {
      key: 'stop',
      value: function stop(element, clearQueue) {
        (0, _Velocity['default'])(element, 'stop', clearQueue);
        this.isAnimating = false;
        return this;
      }
    }, {
      key: 'reverse',
      value: function reverse(element) {
        (0, _Velocity['default'])(element, 'reverse');
        return this;
      }
    }, {
      key: 'rewind',
      value: function rewind(element) {
        (0, _Velocity['default'])(name, 'rewind');
        return this;
      }
    }, {
      key: 'registerEffect',
      value: function registerEffect(name, props) {
        if (name[0] === ':') {
          if (typeof props === 'string') {
            this.effects[name] = props;
          } else {
            throw new Error('second parameter must be a string when registering aliases');
          }
        } else {
          _Velocity['default'].RegisterEffect(name, props);
        }
        return this;
      }
    }, {
      key: 'unregisterEffect',
      value: function unregisterEffect(name) {
        delete this.effects[name];
        return this;
      }
    }, {
      key: 'runSequence',
      value: function runSequence(sequence) {
        var _this2 = this;

        dispatch(window, 'sequenceBegin');
        return new Promise(function (resolve, reject) {
          _this2.sequenceReject = resolve;
          var last = sequence[sequence.length - 1];
          last.options = last.options || last.o || {};
          last.options.complete = function () {
            if (!_this2.sequenceReject) return;
            _this2.sequenceReject = undefined;
            dispatch(window, 'sequenceDone');
            resolve();
          };
          try {
            _Velocity['default'].RunSequence(sequence);
          } catch (e) {
            _this2.stopSequence(sequence);
            _this2.sequenceReject(e);
          }
        });
      }
    }, {
      key: 'stopSequence',
      value: function stopSequence(sequence) {
        var _this3 = this;

        sequence.map(function (item) {
          var el = item.e || item.element || item.elements;
          _this3.stop(el, true);
        });
        if (this.sequenceReject) {
          this.sequenceReject();
          this.sequenceReject = undefined;
        }
        dispatch(window, 'sequenceDone');
        return this;
      }
    }, {
      key: 'resolveEffectAlias',
      value: function resolveEffectAlias(alias) {
        if (typeof alias === 'string' && alias[0] === ':') {
          return this.effects[alias];
        }
        return alias;
      }
    }, {
      key: 'enter',
      value: function enter(element, effectName, options) {
        return this.stop(element, true)._runElementAnimation(element, effectName || ':enter', options, 'enter');
      }
    }, {
      key: 'leave',
      value: function leave(element, effectName, options) {
        return this.stop(element, true)._runElementAnimation(element, effectName || ':leave', options, 'leave').then(function (elements) {});
      }
    }, {
      key: '_runElements',
      value: function _runElements(element, name) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        if (!element) return Promise.reject(new Error('invalid first argument'));

        if (typeof element === 'string') element = this.container.querySelectorAll(element);

        if (!element || element.length === 0) return Promise.resolve(element);

        for (var i = 0; i < element.length; i++) {
          this._runElementAnimation(element[i], name, options);
        }
      }
    }, {
      key: '_runElementAnimation',
      value: function _runElementAnimation(element, name) {
        var _this4 = this,
            _arguments = arguments;

        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var eventName = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

        if (!element) return Promise.reject(new Error('invalid first argument'));

        if (typeof element === 'string') element = this.container.querySelectorAll(element);

        if (!element || element.length === 0) return Promise.resolve(element);

        if (!element.animations) this.parseAttributes(element);

        if (eventName) dispatch(element, eventName + 'Begin');

        var overrides = {
          complete: function complete(elements) {
            _this4.isAnimating = false;
            if (eventName) dispatch(element, eventName + 'Done');
            if (options && options.complete) options.complete.apply(_this4, _arguments);
          }
        };

        var opts = Object.assign({}, this.options, options, overrides);
        return this.animate(element, name, opts, true);
      }
    }, {
      key: 'parseAttributes',
      value: function parseAttributes(element) {
        var el = undefined,
            i = undefined,
            l = undefined;
        element = this.ensureList(element);
        for (i = 0, l = element.length; i < l; i++) {
          el = element[i];
          el.animations = {};
          el.animations.enter = this.parseAttributeValue(el.getAttribute('anim-enter')) || this.enterAnimation;
          el.animations.leave = this.parseAttributeValue(el.getAttribute('anim-leave')) || this.leaveAnimation;
        }
      }
    }, {
      key: 'parseAttributeValue',
      value: function parseAttributeValue(value) {
        if (!value) return value;
        var p = value.split(';');
        var properties = p[0];
        var options = {};
        if (properties[0] == '{' && properties[properties.length - 1] == '}') properties = _JSOL['default'].parse(properties);

        if (p.length > 1) {
          options = p[1];
          options = _JSOL['default'].parse(options);
        }
        return { properties: properties, options: options };
      }
    }, {
      key: 'ensureList',
      value: function ensureList(element) {
        if (!Array.isArray(element) && !(element instanceof NodeList)) element = [element];
        return element;
      }
    }]);

    return VelocityAnimator;
  })();

  exports.VelocityAnimator = VelocityAnimator;

  function dispatch(element, name) {
    var evt = new CustomEvent(_aureliaTemplating.animationEvent[name], { bubbles: true, cancelable: true, detail: element });
    document.dispatchEvent(evt);
  }
});
//# sourceMappingURL=animator.js.map