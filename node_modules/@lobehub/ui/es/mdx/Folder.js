'use client';

import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/esm/taggedTemplateLiteral";
var _excluded = ["name", "defaultOpen", "icon", "children"];
var _templateObject, _templateObject2;
import { createStyles } from 'antd-style';
import { FolderIcon, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import Icon from "../Icon";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useStyles = createStyles(function (_ref) {
  var css = _ref.css,
    token = _ref.token;
  return {
    folder: css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      cursor: pointer;\n\n      &:hover {\n        color: ", ";\n      }\n    "])), token.colorText),
    folderChildren: css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n      padding-inline-start: 1em;\n    "])))
  };
});
var Folder = function Folder(_ref2) {
  var name = _ref2.name,
    defaultOpen = _ref2.defaultOpen,
    _ref2$icon = _ref2.icon,
    icon = _ref2$icon === void 0 ? FolderIcon : _ref2$icon,
    children = _ref2.children,
    rest = _objectWithoutProperties(_ref2, _excluded);
  var _useState = useState(defaultOpen),
    _useState2 = _slicedToArray(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var _useStyles = useStyles(),
    styles = _useStyles.styles;
  return /*#__PURE__*/_jsxs(Flexbox, _objectSpread(_objectSpread({}, rest), {}, {
    children: [/*#__PURE__*/_jsxs(Flexbox, {
      align: 'center',
      className: styles.folder,
      gap: 4,
      horizontal: true,
      onClick: function onClick() {
        return setOpen(!open);
      },
      children: [/*#__PURE__*/_jsx(Icon, {
        icon: open ? FolderOpen : icon
      }), /*#__PURE__*/_jsx("span", {
        children: name
      })]
    }), open && /*#__PURE__*/_jsx(Flexbox, {
      className: styles.folderChildren,
      children: children
    })]
  }));
};
export default Folder;