
/* IMPORT */

import {isAmbiguous, isFullWidth, isWide} from './utils';
import type {TruncationOptions, WidthOptions, Result} from './types';

/* HELPERS */

const ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y;
const CONTROL_RE = /[\x00-\x1F\x7F-\x9F]{1,1000}/y;
const EMOJI_RE = /(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\u200d(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*/yu;
const LATIN_RE = /[\x20-\x7E\xA0-\xFF]{1,1000}/y;
const MODIFIER_RE = /\p{M}+/gu;
const NO_TRUNCATION: TruncationOptions = { limit: Infinity, ellipsis: '' };

/* MAIN */

//TODO: Optimize matching non-latin letters

const getStringTruncatedWidth = ( input: string, truncationOptions: TruncationOptions = {}, widthOptions: WidthOptions = {} ): Result => {

  /* CONSTANTS */

  const LIMIT = truncationOptions.limit ?? Infinity;
  const ELLIPSIS = truncationOptions.ellipsis ?? '';
  const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? ( ELLIPSIS ? getStringTruncatedWidth ( ELLIPSIS, NO_TRUNCATION, widthOptions ).width : 0 );

  const ANSI_WIDTH = widthOptions.ansiWidth ?? 0;
  const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;

  const AMBIGUOUS_WIDTH = widthOptions.ambiguousWidth ?? 1;
  const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
  const FULL_WIDTH_WIDTH = widthOptions.fullWidthWidth ?? 2;
  const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
  const WIDE_WIDTH = widthOptions.wideWidth ?? 2;

  /* STATE */

  let indexPrev = 0;
  let index = 0;
  let length = input.length;
  let lengthExtra = 0;
  let truncationEnabled = false;
  let truncationIndex = length;
  let truncationLimit = Math.max ( 0, LIMIT - ELLIPSIS_WIDTH );
  let unmatchedStart = 0;
  let unmatchedEnd = 0;
  let width = 0;
  let widthExtra = 0;

  /* PARSE LOOP */

  outer:
  while ( true ) {

    /* UNMATCHED */

    if ( ( unmatchedEnd > unmatchedStart ) || ( index >= length && index > indexPrev ) ) {

      const unmatched = input.slice ( unmatchedStart, unmatchedEnd ) || input.slice ( indexPrev, index );

      lengthExtra = 0;

      for ( const char of unmatched.replaceAll ( MODIFIER_RE, '' ) ) {

        const codePoint = char.codePointAt ( 0 ) || 0;

        if ( isFullWidth ( codePoint ) ) {
          widthExtra = FULL_WIDTH_WIDTH;
        } else if ( isWide ( codePoint ) ) {
          widthExtra = WIDE_WIDTH;
        } else if ( AMBIGUOUS_WIDTH !== REGULAR_WIDTH && isAmbiguous ( codePoint ) ) {
          widthExtra = AMBIGUOUS_WIDTH;
        } else {
          widthExtra = REGULAR_WIDTH;
        }

        if ( ( width + widthExtra ) > truncationLimit ) {
          truncationIndex = Math.min ( truncationIndex, Math.max ( unmatchedStart, indexPrev ) + lengthExtra );
        }

        if ( ( width + widthExtra ) > LIMIT ) {
          truncationEnabled = true;
          break outer;
        }

        lengthExtra += char.length;
        width += widthExtra;

      }

      unmatchedStart = unmatchedEnd = 0;

    }

    /* EXITING */

    if ( index >= length ) break;

    /* LATIN */

    LATIN_RE.lastIndex = index;

    if ( LATIN_RE.test ( input ) ) {

      lengthExtra = LATIN_RE.lastIndex - index;
      widthExtra = lengthExtra * REGULAR_WIDTH;

      if ( ( width + widthExtra ) > truncationLimit ) {
        truncationIndex = Math.min ( truncationIndex, index + Math.floor ( ( truncationLimit - width ) / REGULAR_WIDTH ) );
      }

      if ( ( width + widthExtra ) > LIMIT ) {
        truncationEnabled = true;
        break;
      }

      width += widthExtra;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = LATIN_RE.lastIndex;

      continue;

    }

    /* ANSI */

    ANSI_RE.lastIndex = index;

    if ( ANSI_RE.test ( input ) ) {

      if ( ( width + ANSI_WIDTH ) > truncationLimit ) {
        truncationIndex = Math.min ( truncationIndex, index );
      }

      if ( ( width + ANSI_WIDTH ) > LIMIT ) {
        truncationEnabled = true;
        break;
      }

      width += ANSI_WIDTH;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = ANSI_RE.lastIndex;

      continue;

    }

    /* CONTROL */

    CONTROL_RE.lastIndex = index;

    if ( CONTROL_RE.test ( input ) ) {

      lengthExtra = CONTROL_RE.lastIndex - index;
      widthExtra = lengthExtra * CONTROL_WIDTH;

      if ( ( width + widthExtra ) > truncationLimit ) {
        truncationIndex = Math.min ( truncationIndex, index + Math.floor ( ( truncationLimit - width ) / CONTROL_WIDTH ) );
      }

      if ( ( width + widthExtra ) > LIMIT ) {
        truncationEnabled = true;
        break;
      }

      width += widthExtra;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = CONTROL_RE.lastIndex;

      continue;

    }

    /* EMOJI */

    EMOJI_RE.lastIndex = index;

    if ( EMOJI_RE.test ( input ) ) {

      if ( ( width + EMOJI_WIDTH ) > truncationLimit ) {
        truncationIndex = Math.min ( truncationIndex, index );
      }

      if ( ( width + EMOJI_WIDTH ) > LIMIT ) {
        truncationEnabled = true;
        break;
      }

      width += EMOJI_WIDTH;
      unmatchedStart = indexPrev;
      unmatchedEnd = index;
      index = indexPrev = EMOJI_RE.lastIndex;

      continue;

    }

    /* UNMATCHED INDEX */

    index += 1;

  }

  /* RETURN */

  return {
    width: truncationEnabled ? truncationLimit : width,
    index: truncationEnabled ? truncationIndex : length,
    truncated: truncationEnabled,
    ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
  };

};

/* EXPORT */

export default getStringTruncatedWidth;
export type {TruncationOptions, WidthOptions, Result};
