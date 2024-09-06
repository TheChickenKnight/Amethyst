import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export function isFlagEmoji(emoji) {
  var flagRegex = /(?:\uD83C[\uDDE6-\uDDFF]){2}/;
  return flagRegex.test(emoji);
}
export function emojiToUnicode(emoji) {
  return _toConsumableArray(emoji).map(function (char) {
    var _char$codePointAt;
    return char === null || char === void 0 || (_char$codePointAt = char.codePointAt(0)) === null || _char$codePointAt === void 0 ? void 0 : _char$codePointAt.toString(16);
  }).join('-');
}
export function emojiAnimPkg(emoji) {
  var mainPart = emojiToUnicode(emoji).split('-')[0];
  if (mainPart < '1f469') {
    return '@lobehub/fluent-emoji-anim-1';
  } else if (mainPart >= '1f469' && mainPart < '1f620') {
    return '@lobehub/fluent-emoji-anim-2';
  } else if (mainPart >= '1f620' && mainPart < '1f9a0') {
    return '@lobehub/fluent-emoji-anim-3';
  } else {
    return '@lobehub/fluent-emoji-anim-4';
  }
}
export var genEmojiUrl = function genEmojiUrl(emoji, type) {
  var ext = ['anim', '3d'].includes(type) ? 'webp' : 'svg';
  switch (type) {
    case 'pure':
      {
        return null;
      }
    case 'anim':
      {
        return {
          path: "assets/".concat(emojiToUnicode(emoji), ".").concat(ext),
          pkg: emojiAnimPkg(emoji),
          version: '1.0.0'
        };
      }
    case '3d':
      {
        return {
          path: "assets/".concat(emojiToUnicode(emoji), ".").concat(ext),
          pkg: '@lobehub/fluent-emoji-3d',
          version: '1.1.0'
        };
      }
    case 'flat':
      {
        return {
          path: "assets/".concat(emojiToUnicode(emoji), ".").concat(ext),
          pkg: '@lobehub/fluent-emoji-flat',
          version: '1.1.0'
        };
      }
    case 'modern':
      {
        return {
          path: "assets/".concat(emojiToUnicode(emoji), ".").concat(ext),
          pkg: '@lobehub/fluent-emoji-modern',
          version: '1.0.0'
        };
      }
    case 'mono':
      {
        return {
          path: "assets/".concat(emojiToUnicode(emoji), ".").concat(ext),
          pkg: '@lobehub/fluent-emoji-mono',
          version: '1.1.0'
        };
      }
  }
};