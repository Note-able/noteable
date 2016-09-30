import React from 'react';

const createElement = React.createElement;

export function PencilIcon() {
  return createElement('svg', { viewBox: '0 0 80 60', fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 1.41 },
    createElement('path', { strokeWidth: '.91', stroke: '#000', d: 'M32.13 6.13H40v34.92h-7.87z', transform: 'matrix(.88634 .56292 -.61638 .97052 21.9 -13.76)' }),
    createElement('path', { d: 'M40 2.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75V5h8V2.75z', strokeWidth: '.75', stroke: '#000', transform: 'matrix(.87226 .55398 -.84354 1.32819 24.17 -16.08)' }),
    createElement('path', { d: 'M36 43l3.9 6.83c.02.03.02.08 0 .11a.14.14 0 0 1-.12.06h-7.54a.15.15 0 0 1-.12-.06.12.12 0 0 1-.01-.13L36 43z', strokeWidth: '.91', stroke: '#000', transform: 'matrix(-.87226 -.55398 .61965 -.97566 27.62 117.26)' }));
}
