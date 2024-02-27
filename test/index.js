
/* IMPORT */

import {describe} from 'fava';
import fastStringTruncatedWidth from '../dist/index.js';
import {getWidth, getTruncated} from './fixtures.js';

/* HELPERS */

/* MAIN */

describe ( 'Fast String Width', () => {

  describe ( 'calculating the raw result', it => {

    it ( 'supports strings that do not need to be truncated', t => {

      const result = fastStringTruncatedWidth ( '\x1b[31mhello', { limit: Infinity, ellipsis: '…' } );

      t.is ( result.truncated, false );
      t.is ( result.ellipsed, false );
      t.is ( result.width, 5 );
      t.is ( result.index, 10 );

    });

    it ( 'supports strings that do need to be truncated', t => {

      const result = fastStringTruncatedWidth ( '\x1b[31mhello', { limit: 3, ellipsis: '…' } );

      t.is ( result.truncated, true );
      t.is ( result.ellipsed, true );
      t.is ( result.width, 2 );
      t.is ( result.index, 7 );

    });

  });

  describe ( 'calculating the width of a string', it => {

    it ( 'supports basic cases', t => {

      t.is ( getWidth ( 'hello' ), 5 );
      t.is ( getWidth ( '\x1b[31mhello' ), 5 );

      t.is ( getWidth ( 'abcde' ), 5 );
      t.is ( getWidth ( '古池や' ), 6 );
      t.is ( getWidth ( 'あいうabc' ), 9 );
      t.is ( getWidth ( 'あいう★' ), 7 );
      t.is ( getWidth ( '±' ), 1 );
      t.is ( getWidth ( 'ノード.js' ), 9 );
      t.is ( getWidth ( '你好' ), 4 );
      t.is ( getWidth ( '안녕하세요' ), 10 );
      t.is ( getWidth ( 'A\uD83C\uDE00BC' ), 5 );
      t.is ( getWidth ( '\u001B[31m\u001B[39m' ), 0 );
      // t.is ( getWidth ( '\u001B]8;;https://github.com\u0007Click\u001B]8;;\u0007' ), 5 ); //TODO: Maybe support these extra escapes too?
      t.is ( getWidth ( '\u{231A}' ), 2 );
      t.is ( getWidth ( '\u{2194}\u{FE0F}' ), 2 );
      t.is ( getWidth ( '\u{1F469}' ), 2 );
      t.is ( getWidth ( '\u{1F469}\u{1F3FF}' ), 2 );
      t.is ( getWidth ( '\u{845B}\u{E0100}' ), 2 );
      t.is ( getWidth ( 'ปฏัก' ), 3 );
      t.is ( getWidth ( '_\u0E34' ), 1 );

    });

    it ( 'supports control characters', t => {

      t.is ( getWidth ( String.fromCodePoint ( 0 ) ), 0 );
      t.is ( getWidth ( String.fromCodePoint ( 31 ) ), 0 );
      t.is ( getWidth ( String.fromCodePoint ( 127 ) ), 0 );
      t.is ( getWidth ( String.fromCodePoint ( 134 ) ), 0 );
      t.is ( getWidth ( String.fromCodePoint ( 159 ) ), 0 );
      t.is ( getWidth ( '\u001B' ), 0 );

    });

    it ( 'supports combining characters', t => {

      t.is ( getWidth ( 'x\u0300' ), 1 );

    });

    it ( 'supports emoji characters', t => {

      t.is ( getWidth ( '👶' ), 2 );
      t.is ( getWidth ( '👶🏽' ), 2 );
      t.is ( getWidth ( '👩‍👩‍👦‍👦' ), 2 );
      t.is ( getWidth ( '👨‍❤️‍💋‍👨' ), 2 );

      t.is ( getWidth ( '👶'.repeat ( 2 ) ), 4 );
      t.is ( getWidth ( '👶🏽'.repeat ( 2 ) ), 4 );
      t.is ( getWidth ( '👩‍👩‍👦‍👦'.repeat ( 2 ) ), 4 );
      t.is ( getWidth ( '👨‍❤️‍💋‍👨'.repeat ( 2 ) ), 4 );

    });

    it ( 'supports unicode characters', t => {

      t.is ( getWidth ( '…' ), 1 );
      t.is ( getWidth ( '\u2770' ), 1 );
      t.is ( getWidth ( '\u2771' ), 1 );
      t.is ( getWidth ( '\u21a9' ), 1 );
      t.is ( getWidth ( '\u2193' ), 1 );
      t.is ( getWidth ( '\u21F5' ), 1 );
      t.is ( getWidth ( '\u2937' ), 1 );
      t.is ( getWidth ( '\u27A4' ), 1 );
      t.is ( getWidth ( '\u2190' ), 1 );
      t.is ( getWidth ( '\u21d0' ), 1 );
      t.is ( getWidth ( '\u2194' ), 1 );
      t.is ( getWidth ( '\u21d4' ), 1 );
      t.is ( getWidth ( '\u21ce' ), 1 );
      t.is ( getWidth ( '\u27f7' ), 1 );
      t.is ( getWidth ( '\u2192' ), 1 );
      t.is ( getWidth ( '\u21d2' ), 1 );
      t.is ( getWidth ( '\u21e8' ), 1 );
      t.is ( getWidth ( '\u2191' ), 1 );
      t.is ( getWidth ( '\u21C5' ), 1 );
      t.is ( getWidth ( '\u2197' ), 1 );
      t.is ( getWidth ( '\u21cb' ), 1 );
      t.is ( getWidth ( '\u21cc' ), 1 );
      t.is ( getWidth ( '\u21c6' ), 1 );
      t.is ( getWidth ( '\u21c4' ), 1 );
      t.is ( getWidth ( '\u2217' ), 1 );
      t.is ( getWidth ( '✔' ), 1 );
      t.is ( getWidth ( '\u2014' ), 1 );
      t.is ( getWidth ( '\u2022' ), 1 );
      t.is ( getWidth ( '\u2026' ), 1 );
      t.is ( getWidth ( '\u2013' ), 1 );
      t.is ( getWidth ( '\u2709' ), 1 );
      t.is ( getWidth ( '\u2261' ), 1 );
      t.is ( getWidth ( '\u2691' ), 1 );
      t.is ( getWidth ( '\u2690' ), 1 );
      t.is ( getWidth ( '\u22EF' ), 1 );
      t.is ( getWidth ( '\u226A' ), 1 );
      t.is ( getWidth ( '\u226B' ), 1 );
      t.is ( getWidth ( '\u270E' ), 1 );
      t.is ( getWidth ( '\u00a0' ), 1 );
      t.is ( getWidth ( '\u2009' ), 1 );
      t.is ( getWidth ( '\u200A' ), 1 );
      t.is ( getWidth ( '\u274F' ), 1 );
      t.is ( getWidth ( '\u2750' ), 1 );
      t.is ( getWidth ( '\u26a0' ), 1 );
      t.is ( getWidth ( '\u200b' ), 1 );

    });

    it ( 'supports japanese half-width characters', t => {

      t.is ( getWidth ( 'ﾊﾞ' ), 2 );
      t.is ( getWidth ( 'ﾊﾟ' ), 2 );

    });

  });

  describe ( 'truncating a string', it => {

    it ( 'supports latin characters', t => {

      t.is ( getTruncated ( 'hello', { limit: 10, ellipsis: '…' } ), 'hello' );
      t.is ( getTruncated ( 'hello', { limit: 5, ellipsis: '…' } ), 'hello' );
      t.is ( getTruncated ( 'hello', { limit: 4, ellipsis: '…' } ), 'hel…' );
      t.is ( getTruncated ( 'hello', { limit: 3, ellipsis: '…' } ), 'he…' );
      t.is ( getTruncated ( 'hello', { limit: 2, ellipsis: '…' } ), 'h…' );
      t.is ( getTruncated ( 'hello', { limit: 1, ellipsis: '…' } ), '…' );
      t.is ( getTruncated ( 'hello', { limit: 0, ellipsis: '…' } ), '' );

      t.is ( getTruncated ( 'hello', { limit: 10, ellipsis: '..' } ), 'hello' );
      t.is ( getTruncated ( 'hello', { limit: 5, ellipsis: '..' } ), 'hello' );
      t.is ( getTruncated ( 'hello', { limit: 4, ellipsis: '..' } ), 'he..' );
      t.is ( getTruncated ( 'hello', { limit: 3, ellipsis: '..' } ), 'h..' );
      t.is ( getTruncated ( 'hello', { limit: 2, ellipsis: '..' } ), '..' );
      t.is ( getTruncated ( 'hello', { limit: 1, ellipsis: '..' } ), '' );
      t.is ( getTruncated ( 'hello', { limit: 0, ellipsis: '..' } ), '' );

    });

    it ( 'supports ansi characters', t => {

      t.is ( getTruncated ( '\x1b[31mhello', { limit: 10, ellipsis: '…' } ), '\x1b[31mhello' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 5, ellipsis: '…' } ), '\x1b[31mhello' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 4, ellipsis: '…' } ), '\x1b[31mhel…' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 3, ellipsis: '…' } ), '\x1b[31mhe…' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 2, ellipsis: '…' } ), '\x1b[31mh…' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 1, ellipsis: '…' } ), '\x1b[31m…' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 0, ellipsis: '…' } ), '\x1b[31m' );

      t.is ( getTruncated ( '\x1b[31mhello', { limit: 10, ellipsis: '..' } ), '\x1b[31mhello' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 5, ellipsis: '..' } ), '\x1b[31mhello' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 4, ellipsis: '..' } ), '\x1b[31mhe..' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 3, ellipsis: '..' } ), '\x1b[31mh..' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 2, ellipsis: '..' } ), '\x1b[31m..' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 1, ellipsis: '..' } ), '\x1b[31m' );
      t.is ( getTruncated ( '\x1b[31mhello', { limit: 0, ellipsis: '..' } ), '\x1b[31m' );

    });

    it ( 'supports control characters', t => {

      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 10, ellipsis: '…' } ), '\x00\x01\x02\x03' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 4, ellipsis: '…' } ), '\x00\x01\x02\x03' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 3, ellipsis: '…' } ), '\x00\x01\x02\x03' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 2, ellipsis: '…' } ), '\x00\x01\x02\x03' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 1, ellipsis: '…' } ), '\x00\x01\x02\x03' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 0, ellipsis: '…' } ), '\x00\x01\x02\x03' );

      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 10, ellipsis: '…' }, { controlWidth: 1 } ), '\x00\x01\x02\x03' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 4, ellipsis: '…' }, { controlWidth: 1 } ), '\x00\x01\x02\x03' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 3, ellipsis: '…' }, { controlWidth: 1 } ), '\x00\x01…' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 2, ellipsis: '…' }, { controlWidth: 1 } ), '\x00…' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 1, ellipsis: '…' }, { controlWidth: 1 } ), '…' );
      t.is ( getTruncated ( '\x00\x01\x02\x03', { limit: 0, ellipsis: '…' }, { controlWidth: 1 } ), '' );

    });

    it ( 'supports CJK characters', t => {

      t.is ( getTruncated ( '古池や', { limit: 10, ellipsis: '…' } ), '古池や' );
      t.is ( getTruncated ( '古池や', { limit: 6, ellipsis: '…' } ), '古池や' );
      t.is ( getTruncated ( '古池や', { limit: 5, ellipsis: '…' } ), '古池…' );
      t.is ( getTruncated ( '古池や', { limit: 4, ellipsis: '…' } ), '古…' );
      t.is ( getTruncated ( '古池や', { limit: 3, ellipsis: '…' } ), '古…' );
      t.is ( getTruncated ( '古池や', { limit: 2, ellipsis: '…' } ), '…' );
      t.is ( getTruncated ( '古池や', { limit: 1, ellipsis: '…' } ), '…' );
      t.is ( getTruncated ( '古池や', { limit: 0, ellipsis: '…' } ), '' );

    });

    it ( 'supports emoji characters', t => {

      t.is ( getTruncated ( '👶👶🏽', { limit: 10, ellipsis: '…' } ), '👶👶🏽' );
      t.is ( getTruncated ( '👶👶🏽', { limit: 4, ellipsis: '…' } ), '👶👶🏽' );
      t.is ( getTruncated ( '👶👶🏽', { limit: 3, ellipsis: '…' } ), '👶…' );
      t.is ( getTruncated ( '👶👶🏽', { limit: 2, ellipsis: '…' } ), '…' );
      t.is ( getTruncated ( '👶👶🏽', { limit: 1, ellipsis: '…' } ), '…' );
      t.is ( getTruncated ( '👶👶🏽', { limit: 0, ellipsis: '…' } ), '' );

      t.is ( getTruncated ( '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨', { limit: 10, ellipsis: '…' } ), '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨' );
      t.is ( getTruncated ( '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨', { limit: 4, ellipsis: '…' } ), '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨' );
      t.is ( getTruncated ( '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨', { limit: 3, ellipsis: '…' } ), '👩‍👩‍👦‍👦…' );
      t.is ( getTruncated ( '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨', { limit: 2, ellipsis: '…' } ), '…' );
      t.is ( getTruncated ( '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨', { limit: 1, ellipsis: '…' } ), '…' );
      t.is ( getTruncated ( '👩‍👩‍👦‍👦👨‍❤️‍💋‍👨', { limit: 0, ellipsis: '…' } ), '' );

    });

  });

});
