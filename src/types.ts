
/* MAIN */

type TruncationOptions = {
  limit?: number,
  ellipsis?: string,
  ellipsisWidth?: number
};

type WidthOptions = {
  /* SPECIAL */
  controlWidth?: number,
  tabWidth?: number,
  /* OTHERS */
  emojiWidth?: number,
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
