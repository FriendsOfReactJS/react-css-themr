"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeable = themeable;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var _invariant = _interopRequireDefault(require("invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @typedef {Object.<string, TReactCSSThemrTheme>} TReactCSSThemrTheme
 */

/**
 * @typedef {{}} TReactCSSThemrOptions
 * @property {String|Boolean} [composeTheme=COMPOSE_DEEPLY]
 */
var COMPOSE_DEEPLY = 'deeply';
var COMPOSE_SOFTLY = 'softly';
var DONT_COMPOSE = false;
var DEFAULT_OPTIONS = {
  composeTheme: COMPOSE_DEEPLY,
  mapThemrProps: defaultMapThemrProps
};
var THEMR_CONFIG = typeof Symbol !== 'undefined' ? Symbol('THEMR_CONFIG') : '__REACT_CSS_THEMR_CONFIG__';
/**
 * Themr decorator
 * @param {String|Number|Symbol} componentName - Component name
 * @param {TReactCSSThemrTheme} [localTheme] - Base theme
 * @param {{}} [options] - Themr options
 * @returns {function(ThemedComponent:Function):Function} - ThemedComponent
 */

var _default = function _default(componentName, localTheme) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (ThemedComponent) {
    var _DEFAULT_OPTIONS$opti = _objectSpread({}, DEFAULT_OPTIONS, {}, options),
        optionComposeTheme = _DEFAULT_OPTIONS$opti.composeTheme,
        optionMapThemrProps = _DEFAULT_OPTIONS$opti.mapThemrProps;

    validateComposeOption(optionComposeTheme);
    var config = ThemedComponent[THEMR_CONFIG];

    if (config && config.componentName === componentName) {
      config.localTheme = themeable(config.localTheme, localTheme);
      return ThemedComponent;
    }

    config = {
      componentName: componentName,
      localTheme: localTheme
    };
    /**
     * @property {{wrappedInstance: *}} refs
     */

    var Themed = /*#__PURE__*/function (_Component) {
      _inherits(Themed, _Component);

      function Themed() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, Themed);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Themed)).call.apply(_getPrototypeOf2, [this].concat(args)));
        _this.theme_ = _this.calcTheme(_this.props);
        return _this;
      }

      _createClass(Themed, [{
        key: "getWrappedInstance",
        value: function getWrappedInstance() {
          (0, _invariant["default"])(true, 'DEPRECATED: To access the wrapped instance, you have to pass ' + '{ innerRef: fn } and retrieve with a callback ref style.');
          return this.refs.wrappedInstance;
        }
      }, {
        key: "getNamespacedTheme",
        value: function getNamespacedTheme(props) {
          var themeNamespace = props.themeNamespace,
              theme = props.theme;
          if (!themeNamespace) return theme;

          if (themeNamespace && !theme) {
            throw new Error('Invalid themeNamespace use in friendsofreactjs/react-css-themr. ' + 'themeNamespace prop should be used only with theme prop.');
          }

          return Object.keys(theme).filter(function (key) {
            return key.startsWith(themeNamespace);
          }).reduce(function (result, key) {
            return _objectSpread({}, result, _defineProperty({}, removeNamespace(key, themeNamespace), theme[key]));
          }, {});
        }
      }, {
        key: "getThemeNotComposed",
        value: function getThemeNotComposed(props) {
          var theme = props.theme;
          if (theme) return this.getNamespacedTheme(props);
          if (config.localTheme) return config.localTheme;
          return this.getContextTheme();
        }
      }, {
        key: "getContextTheme",
        value: function getContextTheme() {
          return this.context.themr ? this.context.themr.theme[config.componentName] : {};
        }
      }, {
        key: "getTheme",
        value: function getTheme(props) {
          var composeTheme = props.composeTheme;
          return composeTheme === COMPOSE_SOFTLY ? _objectSpread({}, this.getContextTheme(), {}, config.localTheme, {}, this.getNamespacedTheme(props)) : themeable(themeable(this.getContextTheme(), config.localTheme), this.getNamespacedTheme(props));
        }
      }, {
        key: "calcTheme",
        value: function calcTheme(props) {
          var composeTheme = props.composeTheme;
          return composeTheme ? this.getTheme(props) : this.getThemeNotComposed(props);
        }
      }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
          var _this$props = this.props,
              composeTheme = _this$props.composeTheme,
              theme = _this$props.theme,
              themeNamespace = _this$props.themeNamespace;

          if (composeTheme !== nextProps.composeTheme || theme !== nextProps.theme || themeNamespace !== nextProps.themeNamespace) {
            this.theme_ = this.calcTheme(nextProps);
          }

          return true;
        }
      }, {
        key: "render",
        value: function render() {
          return _react["default"].createElement(ThemedComponent, this.props.mapThemrProps(this.props, this.theme_));
        }
      }]);

      return Themed;
    }(_react.Component);

    _defineProperty(Themed, "displayName", "Themed".concat(ThemedComponent.displayName || ThemedComponent.name || 'Component'));

    _defineProperty(Themed, "contextTypes", {
      themr: _propTypes["default"].object
    });

    _defineProperty(Themed, "propTypes", _objectSpread({}, ThemedComponent.propTypes, {
      composeTheme: _propTypes["default"].oneOf([COMPOSE_DEEPLY, COMPOSE_SOFTLY, DONT_COMPOSE]),
      innerRef: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].object]),
      theme: _propTypes["default"].object,
      themeNamespace: _propTypes["default"].string,
      mapThemrProps: _propTypes["default"].func
    }));

    _defineProperty(Themed, "defaultProps", _objectSpread({}, ThemedComponent.defaultProps, {
      composeTheme: optionComposeTheme,
      mapThemrProps: optionMapThemrProps
    }));

    Themed[THEMR_CONFIG] = config;
    return (0, _hoistNonReactStatics["default"])(Themed, ThemedComponent);
  };
};
/**
 * Merges passed themes by concatenating string keys and processing nested themes
 *
 * @param {...TReactCSSThemrTheme} themes - Themes
 * @returns {TReactCSSThemrTheme} - Resulting theme
 */


exports["default"] = _default;

function themeable() {
  for (var _len2 = arguments.length, themes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    themes[_key2] = arguments[_key2];
  }

  return themes.reduce(function (acc, theme) {
    return merge(acc, theme);
  }, {});
}
/**
 * @param {TReactCSSThemrTheme} [original] - Original theme
 * @param {TReactCSSThemrTheme} [mixin] - Mixin theme
 * @returns {TReactCSSThemrTheme} - resulting theme
 */


function merge() {
  var original = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mixin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  //make a copy to avoid mutations of nested objects
  //also strip all functions injected by isomorphic-style-loader
  var result = Object.keys(original).reduce(function (acc, key) {
    var value = original[key];

    if (typeof value !== 'function') {
      acc[key] = value;
    }

    return acc;
  }, {}); //traverse mixin keys and merge them to resulting theme

  Object.keys(mixin).forEach(function (key) {
    //there's no need to set any defaults here
    var originalValue = result[key];
    var mixinValue = mixin[key];

    switch (_typeof(mixinValue)) {
      case 'object':
        {
          //possibly nested theme object
          switch (_typeof(originalValue)) {
            case 'object':
              {
                //exactly nested theme object - go recursive
                result[key] = merge(originalValue, mixinValue);
                break;
              }

            case 'undefined':
              {
                //original does not contain this nested key - just take it as is
                result[key] = mixinValue;
                break;
              }

            default:
              {
                //can't merge an object with a non-object
                throw new Error("You are merging object ".concat(key, " with a non-object ").concat(originalValue));
              }
          }

          break;
        }

      case 'undefined': //fallthrough - handles accidentally unset values which may come from props

      case 'function':
        {
          //this handles issue when isomorphic-style-loader addes helper functions to css-module
          break; //just skip
        }

      default:
        {
          //plain values
          switch (_typeof(originalValue)) {
            case 'object':
              {
                //can't merge a non-object with an object
                throw new Error("You are merging non-object ".concat(mixinValue, " with an object ").concat(key, ", (can occur when using empty or :global only base theme stylesheet)"));
              }

            case 'undefined':
              {
                //mixin key is new to original theme - take it as is
                result[key] = mixinValue;
                break;
              }

            case 'function':
              {
                //this handles issue when isomorphic-style-loader addes helper functions to css-module
                break; //just skip
              }

            default:
              {
                //finally we can merge
                result[key] = originalValue.split(' ').concat(mixinValue.split(' ')).filter(function (item, pos, self) {
                  return self.indexOf(item) === pos && item !== '';
                }).join(' ');
                break;
              }
          }

          break;
        }
    }
  });
  return result;
}
/**
 * Validates compose option
 *
 * @param {String|Boolean} composeTheme - Compose them option
 * @throws
 * @returns {undefined}
 */


function validateComposeOption(composeTheme) {
  if ([COMPOSE_DEEPLY, COMPOSE_SOFTLY, DONT_COMPOSE].indexOf(composeTheme) === -1) {
    throw new Error("Invalid composeTheme option for friendsofreactjs/react-css-themr. Valid composition options are ".concat(COMPOSE_DEEPLY, ", ").concat(COMPOSE_SOFTLY, " and ").concat(DONT_COMPOSE, ". The given option was ").concat(composeTheme));
  }
}
/**
 * Removes namespace from key
 *
 * @param {String} key - Key
 * @param {String} themeNamespace - Theme namespace
 * @returns {String} - Key
 */


function removeNamespace(key, themeNamespace) {
  var capitalized = key.substr(themeNamespace.length);
  return capitalized.slice(0, 1).toLowerCase() + capitalized.slice(1);
}
/**
 * Maps props and theme to an object that will be used to pass down props to the
 * decorated component.
 *
 * @param {Object} ownProps - All props given to the decorated component
 * @param {Object} theme - Calculated then that should be passed down
 * @returns {Object} - Props that will be passed down to the decorated component
 */


function defaultMapThemrProps(ownProps, theme) {
  var composeTheme = ownProps.composeTheme,
      innerRef = ownProps.innerRef,
      themeNamespace = ownProps.themeNamespace,
      mapThemrProps = ownProps.mapThemrProps,
      rest = _objectWithoutProperties(ownProps, ["composeTheme", "innerRef", "themeNamespace", "mapThemrProps"]);

  return _objectSpread({}, rest, {
    ref: innerRef,
    theme: theme
  });
}