
/* MAIN */

type TruncationOptions = {
  limit?: number,
  ellipsis?: string,
  ellipsisWidth?: number
};

type WidthOptions = {
  /* SPECIAL */
  ansiWidth?: number,
  controlWidth?: number,
  /* UNICODE */
  ambiguousWidth?: number,
  emojiWidth?: number,
  fullWidthWidth?: number,
  regularWidth?: number,
  wideWidth?: number
};

type Result = {
  width: number,
  index: number,
  truncated: boolean,
  ellipsed: boolean
};

/* EXPORT */

export type {TruncationOptions, WidthOptions, Result};
