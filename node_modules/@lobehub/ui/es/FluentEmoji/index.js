'use client';

import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { memo, useMemo, useState } from 'react';
import { Center } from 'react-layout-kit';
import { useCdnFn } from "../ConfigProvider";
import Img from "../Img";
import { useStyles } from "./style";
import { genEmojiUrl } from "./utils";
import { jsx as _jsx } from "react/jsx-runtime";
var FluentEmoji = /*#__PURE__*/memo(function (_ref) {
  var emoji = _ref.emoji,
    className = _ref.className,
    style = _ref.style,
    _ref$type = _ref.type,
    type = _ref$type === void 0 ? '3d' : _ref$type,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 40 : _ref$size,
    unoptimized = _ref.unoptimized;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    loadingFail = _useState2[0],
    setLoadingFail = _useState2[1];
  var genCdnUrl = useCdnFn();
  var _useStyles = useStyles(),
    cx = _useStyles.cx,
    styles = _useStyles.styles;
  var emojiUrl = useMemo(function () {
    return genEmojiUrl(emoji, type);
  }, [type, emoji]);
  if (type === 'pure' || !emojiUrl || loadingFail) return /*#__PURE__*/_jsx(Center, {
    className: cx(styles.container, className),
    flex: 'none',
    height: size,
    style: _objectSpread({
      fontSize: size * 0.9
    }, style),
    width: size,
    children: emoji
  });
  return /*#__PURE__*/_jsx(Img, {
    alt: emoji,
    className: className,
    height: size,
    loading: 'lazy',
    onError: function onError() {
      return setLoadingFail(true);
    },
    src: genCdnUrl(emojiUrl),
    style: _objectSpread({
      flex: 'none'
    }, style),
    unoptimized: unoptimized,
    width: size
  });
});
export default FluentEmoji;