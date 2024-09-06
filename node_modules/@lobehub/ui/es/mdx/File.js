'use client';

import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["name", "icon"];
import { FileIcon } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';
import Icon from "../Icon";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var File = function File(_ref) {
  var name = _ref.name,
    _ref$icon = _ref.icon,
    icon = _ref$icon === void 0 ? FileIcon : _ref$icon,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/_jsxs(Flexbox, _objectSpread(_objectSpread({
    align: 'center',
    gap: 4,
    horizontal: true
  }, rest), {}, {
    children: [/*#__PURE__*/_jsx(Icon, {
      icon: icon
    }), /*#__PURE__*/_jsx("span", {
      children: name
    })]
  }));
};
export default File;