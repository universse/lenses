import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'utils/classNames'

const icons = {
  article: (
    <>
      <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
      <path d='M14 2v6h6M16 13H8M16 17H8M10 9H8' />
    </>
  ),
  back: <path d='M19 12H5M12 19l-7-7 7-7' />,
  book: (
    <>
      <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
      <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
    </>
  ),
  category: <path d='M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' />,
  'chevron-down': <path d='M6 9l6 6 6-6' />,
  'chevron-left': <path d='M15 18l-6-6 6-6' />,
  'chevron-right': <path d='M9 18l6-6-6-6' />,
  code: <path d='M16 18l6-6-6-6M8 6l-6 6 6 6' />,
  copy: (
    <>
      <rect height='13' rx='2' ry='2' width='13' x='9' y='9' />
      <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
    </>
  ),
  'copy-url': (
    <path d='M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3M8 12h8' />
  ),
  course: (
    <>
      <rect height='14' rx='2' ry='2' width='20' x='2' y='3' />
      <path d='M8 21h8M12 17v4' />
    </>
  ),
  cross: <path d='M18 6L6 18M6 6l12 12' />,
  edit: (
    <>
      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
    </>
  ),
  'external-link': (
    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3' />
  ),
  facebook: (
    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
  ),
  figma: (
    <>
      <path d='M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z' />
      <path d='M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z' />
      <path d='M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z' />
      <path d='M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z' />
      <path d='M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z' />
    </>
  ),
  filter: (
    <path d='M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6' />
  ),
  heart: (
    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
  ),
  home: (
    <>
      <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
      <path d='M9 22V12h6v10' />
    </>
  ),
  info: (
    <>
      <circle cx='12' cy='12' r='10' />
      <line x1='12' x2='12' y1='16' y2='12' />
      <line x1='12' x2='12' y1='8' y2='8' />
    </>
  ),
  lens: (
    <>
      <circle cx='12' cy='12' r='10' />
      <line x1='14.31' x2='20.05' y1='8' y2='17.94' />
      <line x1='9.69' x2='21.17' y1='8' y2='8' />
      <line x1='7.38' x2='13.12' y1='12' y2='2.06' />
      <line x1='9.69' x2='3.95' y1='16' y2='6.06' />
      <line x1='14.31' x2='2.83' y1='16' y2='16' />
      <line x1='16.62' x2='10.88' y1='12' y2='21.94' />
    </>
  ),
  library: (
    <>
      <line x1='8' x2='21' y1='6' y2='6' />
      <line x1='8' x2='21' y1='12' y2='12' />
      <line x1='8' x2='21' y1='18' y2='18' />
      <line x1='3' x2='3' y1='6' y2='6' />
      <line x1='3' x2='3' y1='12' y2='12' />
      <line x1='3' x2='3' y1='18' y2='18' />
    </>
  ),
  mail: (
    <>
      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
      <path d='M22 6l-10 7L2 6' />
    </>
  ),
  message: (
    <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
  ),
  move: (
    <path d='M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20' />
  ),
  notification: (
    <path d='M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0' />
  ),
  podcast: (
    <path d='M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07' />
  ),
  remove: (
    <path d='M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
  ),
  resources: (
    <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
  ),
  save: <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />,
  search: (
    <>
      <circle cx='11' cy='11' r='8' />
      <path d='M21 21l-4.35-4.35' />
    </>
  ),
  share: (
    <>
      <circle cx='18' cy='5' r='3' />
      <circle cx='6' cy='12' r='3' />
      <circle cx='18' cy='19' r='3' />
      <line x1='8.59' x2='15.42' y1='13.51' y2='17.49' />
      <line x1='15.41' x2='8.59' y1='6.51' y2='10.49' />
    </>
  ),
  'sign-out': (
    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' />
  ),
  tag: (
    <>
      <path d='M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' />
      <line x1='7' x2='7' y1='7' y2='7' />
    </>
  ),
  twitter: (
    <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' />
  ),
  url: (
    <>
      <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
      <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
    </>
  ),
  user: (
    <>
      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </>
  ),
  'user-plus': (
    <>
      <path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
      <circle cx='8.5' cy='7' r='4' />
      <path d='M20 8v6M23 11h-6' />
    </>
  ),
  video: (
    <>
      <circle cx='12' cy='12' r='10' />
      <path d='M10 8l6 4-6 4V8z' />
    </>
  )
}

export default function Icon ({ filled = false, icon, size, label }) {
  if (!icons[icon]) throw new Error('Unknown icon.')

  return (
    <svg
      aria-label={(label || icon).replace(/-/g, ' ')}
      className={classNames('feather', filled && 'filled', size && size)}
      role='img'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <title>{label || icon}</title>
      {icons[icon]}
    </svg>
  )
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  filled: PropTypes.bool,
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
}
