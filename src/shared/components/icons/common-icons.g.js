import React from 'react';

const createElement = React.createElement;

export function CogIcon() {
  return createElement('svg', { width: '16', height: '16', viewBox: '0 0 16 16' },
    createElement('path', { d: 'M14.59 9.54a3.05 3.05 0 0 1 1.13-4.17l-1.58-2.72A3.05 3.05 0 0 1 9.57 0H6.43a3.05 3.05 0 0 1-4.58 2.64L.28 5.36a3.05 3.05 0 0 1 0 5.28l1.58 2.72A3.05 3.05 0 0 1 6.42 16h3.15a3.05 3.05 0 0 1 4.57-2.63l1.57-2.72a3 3 0 0 1-1.12-1.12zM8 11.23a3.24 3.24 0 1 1 0-6.48 3.24 3.24 0 0 1 0 6.48z' }));
}

export function OtherPencilIcon() {
  return createElement('svg', { viewBox: '0 0 80 60', fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: '1.41' },
    createElement('path', { strokeWidth: '.91', stroke: '#000', d: 'M32.13 6.13H40v34.92h-7.87z', transform: 'matrix(.88634 .56292 -.61638 .97052 21.9 -13.76)' }),
    createElement('path', { d: 'M40 2.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75V5h8V2.75z', strokeWidth: '.75', stroke: '#000', transform: 'matrix(.87226 .55398 -.84354 1.32819 24.17 -16.08)' }),
    createElement('path', { d: 'M36 43l3.9 6.83c.02.03.02.08 0 .11a.14.14 0 0 1-.12.06h-7.54a.15.15 0 0 1-.12-.06.12.12 0 0 1-.01-.13L36 43z', strokeWidth: '.91', stroke: '#000', transform: 'matrix(-.87226 -.55398 .61965 -.97566 28.76 115.42)' }),
    createElement('path', { d: 'M48.03 16.02l-.2.73-.28.7-.18.38-.2.37-.68 1.04-.83 1.3-2.1 3.24-2.48 3.81-2.67 4.1-5.15 7.88-3.58 5.47-.65.98-.02.03-.03-.02-.03-.02.02-.03.61-1L33 39.4l4.92-8.02 2.56-4.17 2.39-3.88 2.02-3.27.82-1.31.66-1.05.24-.35.26-.32.52-.55.58-.5.06.04z', fill: '#fff' }));
}

export function PencilIcon() {
  return createElement('svg', { viewBox: '0 0 80 60', fillRule: 'evenodd', clipRule: 'evenodd', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: '1.41' },
    createElement('path', { strokeWidth: '.91', stroke: '#000', d: 'M32.13 6.13H40v34.92h-7.87z', transform: 'matrix(.88634 .56292 -.61638 .97052 21.9 -13.76)' }),
    createElement('path', { d: 'M40 2.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75V5h8V2.75z', strokeWidth: '.75', stroke: '#000', transform: 'matrix(.87226 .55398 -.84354 1.32819 24.17 -16.08)' }),
    createElement('path', { d: 'M36 43l3.9 6.83c.02.03.02.08 0 .11a.14.14 0 0 1-.12.06h-7.54a.15.15 0 0 1-.12-.06.12.12 0 0 1-.01-.13L36 43z', strokeWidth: '.91', stroke: '#000', transform: 'matrix(-.87226 -.55398 .61965 -.97566 27.62 117.26)' }));
}
