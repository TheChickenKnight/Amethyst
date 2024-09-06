import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _regeneratorRuntime from "@babel/runtime/helpers/esm/regeneratorRuntime";
import _createForOfIteratorHelper from "@babel/runtime/helpers/esm/createForOfIteratorHelper";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["scene", "style", "onMouseDown", "onMouseUp", "onMouseHover", "onKeyDown", "onKeyUp", "onStart", "onLookAt", "onFollow", "onWheel", "onLoad", "renderOnDemand"];
import { Application } from '@splinetool/runtime';
import { forwardRef, useEffect, useRef, useState } from 'react';
import ParentSize from "./ParentSize";
import { jsx as _jsx } from "react/jsx-runtime";
var Spline = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var scene = _ref.scene,
    style = _ref.style,
    onMouseDown = _ref.onMouseDown,
    onMouseUp = _ref.onMouseUp,
    onMouseHover = _ref.onMouseHover,
    onKeyDown = _ref.onKeyDown,
    onKeyUp = _ref.onKeyUp,
    onStart = _ref.onStart,
    onLookAt = _ref.onLookAt,
    onFollow = _ref.onFollow,
    onWheel = _ref.onWheel,
    onLoad = _ref.onLoad,
    _ref$renderOnDemand = _ref.renderOnDemand,
    renderOnDemand = _ref$renderOnDemand === void 0 ? true : _ref$renderOnDemand,
    props = _objectWithoutProperties(_ref, _excluded);
  var canvasRef = useRef(null);
  var _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isLoading = _useState2[0],
    setIsLoading = _useState2[1];
  var init = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(speApp, events) {
      var _iterator, _step, event;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return speApp.load(scene);
          case 2:
            _iterator = _createForOfIteratorHelper(events);
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                event = _step.value;
                if (event.cb) {
                  speApp.addEventListener(event.name, event.cb);
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            setIsLoading(false);
            onLoad === null || onLoad === void 0 || onLoad(speApp);
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function init(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  // Initialize runtime when component is mounted
  useEffect(function () {
    setIsLoading(true);
    var speApp;
    var events = [{
      cb: onMouseDown,
      name: 'mouseDown'
    }, {
      cb: onMouseUp,
      name: 'mouseUp'
    }, {
      cb: onMouseHover,
      name: 'mouseHover'
    }, {
      cb: onKeyDown,
      name: 'keyDown'
    }, {
      cb: onKeyUp,
      name: 'keyUp'
    }, {
      cb: onStart,
      name: 'start'
    }, {
      cb: onLookAt,
      name: 'lookAt'
    }, {
      cb: onFollow,
      name: 'follow'
    }, {
      cb: onWheel,
      name: 'scroll'
    }];
    if (canvasRef.current) {
      speApp = new Application(canvasRef.current, {
        renderOnDemand: renderOnDemand
      });
      init(speApp, events);
    }
    return function () {
      for (var _i = 0, _events = events; _i < _events.length; _i++) {
        var event = _events[_i];
        if (event.cb) {
          speApp.removeEventListener(event.name, event.cb);
        }
      }
      speApp.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);
  return /*#__PURE__*/_jsx(ParentSize, _objectSpread(_objectSpread({
    debounceTime: 50,
    parentSizeStyles: style,
    ref: ref
  }, props), {}, {
    children: function children() {
      return /*#__PURE__*/_jsx("canvas", {
        ref: canvasRef,
        style: {
          display: isLoading ? 'none' : 'block'
        }
      });
    }
  }));
});
export default Spline;