
/* IMPORT */

import fastStringTruncatedWidth from '../dist/index.js';

/* MAIN */

const getWidth = ( input, widthOptions ) => {
  return fastStringTruncatedWidth ( input, {}, widthOptions ).width;
};

const getTruncated = ( input, truncationOptions, widthOptions ) => {
  const ellipsis = truncationOptions.ellipsis ?? '';
  const result = fastStringTruncatedWidth ( input, truncationOptions, widthOptions );
  return `${input.slice ( 0, result.index )}${result.ellipsed ? ellipsis : ''}`;
};

/* EXPORT */

export {getWidth, getTruncated};
