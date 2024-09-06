import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _createForOfIteratorHelper from "@babel/runtime/helpers/esm/createForOfIteratorHelper";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["className", "children", "debounceTime", "ignoreDimensions", "parentSizeStyles", "enableDebounceLeadingCall", "resizeObserverPolyfill"];
import { debounce } from 'lodash-es';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

// @TODO remove when upgraded to TS 4 which has its own declaration
import { jsx as _jsx } from "react/jsx-runtime";
var defaultIgnoreDimensions = [];
var defaultParentSizeStyles = {
  height: '100%',
  width: '100%'
};
export default /*#__PURE__*/forwardRef(function ParentSize(_ref, ref) {
  var className = _ref.className,
    children = _ref.children,
    _ref$debounceTime = _ref.debounceTime,
    debounceTime = _ref$debounceTime === void 0 ? 300 : _ref$debounceTime,
    _ref$ignoreDimensions = _ref.ignoreDimensions,
    ignoreDimensions = _ref$ignoreDimensions === void 0 ? defaultIgnoreDimensions : _ref$ignoreDimensions,
    parentSizeStyles = _ref.parentSizeStyles,
    _ref$enableDebounceLe = _ref.enableDebounceLeadingCall,
    enableDebounceLeadingCall = _ref$enableDebounceLe === void 0 ? true : _ref$enableDebounceLe,
    resizeObserverPolyfill = _ref.resizeObserverPolyfill,
    restProps = _objectWithoutProperties(_ref, _excluded);
  var target = useRef(null);
  var animationFrameID = useRef(0);
  var _useState = useState({
      height: 0,
      left: 0,
      top: 0,
      width: 0
    }),
    _useState2 = _slicedToArray(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  var resize = useMemo(function () {
    var normalized = Array.isArray(ignoreDimensions) ? ignoreDimensions : [ignoreDimensions];
    return debounce(function (incoming) {
      setState(function (existing) {
        var stateKeys = Object.keys(existing);
        var keysWithChanges = stateKeys.filter(function (key) {
          return existing[key] !== incoming[key];
        });
        var shouldBail = keysWithChanges.every(function (key) {
          return normalized.includes(key);
        });
        return shouldBail ? existing : incoming;
      });
    }, debounceTime, {
      leading: enableDebounceLeadingCall
    });
  }, [debounceTime, enableDebounceLeadingCall, ignoreDimensions]);
  useEffect(function () {
    var LocalResizeObserver = resizeObserverPolyfill || window.ResizeObserver;
    var observer = new LocalResizeObserver(function (entries) {
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        var _loop = function _loop() {
          var _entry$contentRect;
          var entry = _step.value;
          var _ref2 = (_entry$contentRect = entry === null || entry === void 0 ? void 0 : entry.contentRect) !== null && _entry$contentRect !== void 0 ? _entry$contentRect : {},
            left = _ref2.left,
            top = _ref2.top,
            width = _ref2.width,
            height = _ref2.height;
          animationFrameID.current = window.requestAnimationFrame(function () {
            resize({
              height: height,
              left: left,
              top: top,
              width: width
            });
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    if (target.current) observer.observe(target.current);
    return function () {
      window.cancelAnimationFrame(animationFrameID.current);
      observer.disconnect();
      resize.cancel();
    };
  }, [resize, resizeObserverPolyfill]);
  return /*#__PURE__*/_jsx("div", _objectSpread(_objectSpread({
    className: className,
    ref: mergeRefs([ref, target]),
    style: _objectSpread(_objectSpread({}, defaultParentSizeStyles), parentSizeStyles)
  }, restProps), {}, {
    children: children(_objectSpread(_objectSpread({}, state), {}, {
      ref: target.current,
      resize: resize
    }))
  }));
});