import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import create from 'zustand'
import { get, set } from 'idb-keyval'
import { hsluvToHex, hexToHsluv } from 'hsluv'
// import chroma from 'chroma-js'
// import produce from 'immer'

import Colorblind from 'constants/Colorblind'
import joinStrings from 'utils/classNames'
import { clamp, hexToRgb } from 'utils/color'
import simulateDyslexia from 'utils/simulateDyslexia'

// KEYS
// theming
export const COLOR = 'color'
export const VIBRANCY = 'vibrancy'
export const MODE = 'mode'
export const SPACING = 'spacing'

// simulation
export const BLUR = 'vision--sharpness'
export const BRIGHTNESS = 'sunlight'
export const COLORBLIND = 'color--perception'
export const CONTRAST = 'contrast--sensitivity'
export const DYSLEXIA = 'dyslexia'
export const GHOSTING = 'double--vision'
export const OPACITY = 'cloudy--vision'
export const DEVICE = 'device--usage'
export const TREMBLING_INTENSITY = 'trembling--intensity'

export const Theming = [COLOR, VIBRANCY, MODE, SPACING]

export const Simulation = [
  BLUR,
  BRIGHTNESS,
  COLORBLIND,
  CONTRAST,
  GHOSTING,
  DEVICE,
  OPACITY,
  TREMBLING_INTENSITY
]

export const AllKeys = [...Theming, ...Simulation]

const ZOOM = 'zoom'

export const PALETTE = 'palette'
export const SHADES = 'shades'
// export const THEME = 'theme'

// mode options
const LIGHT = 'light'
const LOW_CONTRAST_LIGHT = 'low-contrast--light'
const HIGH_CONTRAST_LIGHT = 'high-contrast--light'
const DARK = 'dark'
const LOW_CONTRAST_DARK = 'low-contrast--dark'
const HIGH_CONTRAST_DARK = 'high-contrast--dark'
export const SPECTRUM = 'spectrum'

// export const BRAND_COLOR = '#e4234f'
export const BRAND_COLOR = '#276ac1'
const HUE_COUNT = 9
const MAX_VALUE = 360
const MID_VALUE = 50
const DEFAULT_SATURATION = 90

const EmptyArray = Array(HUE_COUNT).fill(null)

// default state
const BRAND_HUE = getHue(BRAND_COLOR)

const DEFAULT_KEY_SCALE = [10, 20, 30, 40, MID_VALUE, 60, 70, 80, 90]
const SPECTRUM_SCALE = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95]

const DEFAULT_LUMINANCE_SCALE = [6, 17, 28, 39, MID_VALUE, 61, 72, 83, 94]
const LOW_CONTRAST_LIGHT_LUMINANCE_SCALE = [38, 45, 52, 59, 66, 73, 80, 87, 94]
const LOW_CONTRAST_DARK_LUMINANCE_SCALE = [6, 13, 20, 27, 34, 41, 48, 55, 62]
const HIGH_CONTRAST_LUMINANCE_SCALE = [2, 14, 26, 38, MID_VALUE, 62, 74, 86, 98]

const SATURATION_SCALE = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95]

const LUMINANCE = 'LUMINANCE'
const KEY_SCALE = 'KEY_SCALE'
const LUMINANCE_SCALE = 'LUMINANCE_SCALE'

const ModeSettings = {
  [LIGHT]: {
    [LUMINANCE]: 45,
    [LUMINANCE_SCALE]: DEFAULT_LUMINANCE_SCALE
  },
  [LOW_CONTRAST_LIGHT]: {
    [LUMINANCE]: 48,
    [LUMINANCE_SCALE]: LOW_CONTRAST_LIGHT_LUMINANCE_SCALE
  },
  [HIGH_CONTRAST_LIGHT]: {
    [LUMINANCE]: 40,
    [LUMINANCE_SCALE]: HIGH_CONTRAST_LUMINANCE_SCALE
  },
  [DARK]: {
    [LUMINANCE]: 55,
    [LUMINANCE_SCALE]: DEFAULT_LUMINANCE_SCALE
  },
  [LOW_CONTRAST_DARK]: {
    [LUMINANCE]: 52,
    [LUMINANCE_SCALE]: LOW_CONTRAST_DARK_LUMINANCE_SCALE
  },
  [HIGH_CONTRAST_DARK]: {
    [LUMINANCE]: 60,
    [LUMINANCE_SCALE]: HIGH_CONTRAST_LUMINANCE_SCALE
  },
  [SPECTRUM]: {
    [KEY_SCALE]: SPECTRUM_SCALE,
    [LUMINANCE_SCALE]: SPECTRUM_SCALE
  }
}

// spacing options
const COMFORTABLE = 'comfortable'
const COMPACT = 'compact'
const DENSE = 'dense'

const LIST_ITEM_HEIGHT = 'LIST_ITEM_HEIGHT'

const SpacingSettings = {
  [COMFORTABLE]: {
    [LIST_ITEM_HEIGHT]: '3rem'
  },
  [COMPACT]: {
    [LIST_ITEM_HEIGHT]: '2.5rem'
  },
  [DENSE]: {
    [LIST_ITEM_HEIGHT]: '2rem'
  }
}

// device options
const KEYBOARD_ONLY = 'keyboard--only'
const HAND_TREMORS = 'mouse--with--hand--tremors'
const SCREEN_READER = 'screen--reader'

// node ids
const CURSOR = 'cursor'
const CURSOR_OVERLAY = 'cursor_overlay'
const CURSOR_SVG = 'cursor_svg'

const HOVER_CLASSNAME = 'fake-cursor-hover' // fake :hover, className to add when fake cursor hovering element

const noMouseCSS =
  '*{cursor:none!important;}@media(pointer:fine){*{pointer-events:none!important;}}'

const DeviceSettings = {
  [KEYBOARD_ONLY]: noMouseCSS,
  [HAND_TREMORS]: `*{cursor:none!important;}#${CURSOR_OVERLAY}{position:fixed;bottom:0;left:0;right:0;top:0;z-index:10000;}#${CURSOR}{pointer-events:none;position:absolute;}a[href].${HOVER_CLASSNAME},button.${HOVER_CLASSNAME},input.${HOVER_CLASSNAME},select.${HOVER_CLASSNAME},textarea.${HOVER_CLASSNAME},label[for].${HOVER_CLASSNAME}{outline:2px solid var(--color);outline-offset:3px;}`,
  [SCREEN_READER]: noMouseCSS
}

const NONE = 'no--simulation'

export const Options = {
  [COLORBLIND]: [NONE, ...Colorblind.FilterTypes],
  [MODE]: [
    LOW_CONTRAST_LIGHT,
    LIGHT,
    HIGH_CONTRAST_LIGHT,
    LOW_CONTRAST_DARK,
    DARK,
    HIGH_CONTRAST_DARK
  ],
  [SPACING]: [COMFORTABLE, COMPACT, DENSE],
  [DEVICE]: [
    NONE,
    KEYBOARD_ONLY,
    // SCREEN_READER,
    HAND_TREMORS
  ]
}

const DefaultTheming = {
  [COLOR]: createBaseColor(BRAND_HUE),
  [MODE]: LIGHT,
  [VIBRANCY]: 9,
  [SPACING]: COMFORTABLE
}

export const DefaultSimulation = {
  [BLUR]: 0,
  [BRIGHTNESS]: 100,
  [DYSLEXIA]: false,
  [COLORBLIND]: NONE,
  [CONTRAST]: 100,
  [GHOSTING]: 0,
  [OPACITY]: 100,
  [DEVICE]: NONE,
  [TREMBLING_INTENSITY]: 3
}

const Controls = {
  //   [VIBRANCY]: [Slider, { max: '9', min: '0' }],
  //   [MODE]: [RadioGroup, {}],
  //   [SPACING]: [RadioGroup, {}],
  //   [DYSLEXIA]: [Slider, {}],
  //   [COLORBLIND]: [RadioGroup, {}],
  //   [BLUR]: [Slider, { className: 'rtl', max: '5', min: '-5', step: '0.1' }],
  //   [CONTRAST]: [Slider, { max: '185', min: '15' }],
  //   [GHOSTING]: [Slider, { max: '8', min: '-8', step: '0.1' }],
  //   [OPACITY]: [Slider, { className: 'rtl', max: '185', min: '15' }],
  //   [BRIGHTNESS]: [Slider, { max: '400', min: '100', step: '10' }],
  //   [DEVICE]: [RadioGroup, {}],
  //   [TREMBLING_INTENSITY]: [Slider, { max: '12', min: '3' }]
}

// --(hyperopia)
const FAR_SIGHTEDNESS = 'far-sightedness'
const CATARACT = 'cataract'
const ELDERLY = 'elderly'
const PERIPHERAL_VISION = 'peripheral--vision'
const TUNNEL_VISION = 'tunnel--vision'
const DIABETIC_RETINOGRAPHY = 'diabeti--retinopathy'
const BLINDNESS = 'total--blindness'

const TOTAL_COLORBLINDNESS = 'total--colorblindness'
const RED_GREEN_COLORBLINDNESS = 'red-green--colorblindness'
const OUTDOOR_ENVIRONMENT = 'outdoor--environment'

const MOTOR_IMPAIRMENT = 'motor-impairment'
const TREMBLING_HANDS = 'hand--tremors'

export const FigmaLenses = [
  NONE,
  FAR_SIGHTEDNESS,
  CATARACT,
  // ELDERLY,
  BLINDNESS,

  TOTAL_COLORBLINDNESS,
  RED_GREEN_COLORBLINDNESS
  // OUTDOOR_ENVIRONMENT,
]

export const LensesSettings = {
  [NONE]: {},
  [FAR_SIGHTEDNESS]: { [BLUR]: 2.5, [CONTRAST]: 96 },
  [CATARACT]: { [OPACITY]: 75 },
  // [PERIPHERAL_VISION]: {},
  // [TUNNEL_VISION]: {},
  [ELDERLY]: {
    [BLUR]: 3,
    [CONTRAST]: 90,
    [DEVICE]: HAND_TREMORS,
    [TREMBLING_INTENSITY]: 3
  },

  [BLINDNESS]: { [BRIGHTNESS]: 0, [DEVICE]: SCREEN_READER },
  [RED_GREEN_COLORBLINDNESS]: { [COLORBLIND]: 'protanopia' },
  [TOTAL_COLORBLINDNESS]: { [COLORBLIND]: 'achromatopsia' },
  // add glare
  // [OUTDOOR_ENVIRONMENT]: { [BRIGHTNESS]: 200, [BLUR]: 0.5 },

  [DYSLEXIA]: { [GHOSTING]: 6, [DYSLEXIA]: true },

  [MOTOR_IMPAIRMENT]: { [DEVICE]: KEYBOARD_ONLY },
  [TREMBLING_HANDS]: { [DEVICE]: HAND_TREMORS, [TREMBLING_INTENSITY]: 7 }
}

export const AllLenses = Object.keys(LensesSettings)

// store
const [useThemeStore, { setState, subscribe, runEffect }] = create(
  withEffect(DefaultSimulation)
)

export const setTheme = (function () {
  let eventTimeout

  return function (theme) {
    clearTimeout(eventTimeout)
    setState(theme)
    eventTimeout = setTimeout(() => window.___log('set theme', theme), 650)
  }
})()

export const setLense = (function () {
  let eventTimeout

  return function (lense) {
    clearTimeout(eventTimeout)
    setState({ ...DefaultSimulation, ...LensesSettings[lense] })
    eventTimeout = setTimeout(() => window.___log('set lense', { lense }), 650)
  }
})()

export const resetSimulation = () => setState(DefaultSimulation)

let styleNode

export function initializeTheming () {
  styleNode = document.body.appendChild(document.createElement('style'))

  // COLOR
  const colorCSSNode = styleNode.appendChild(document.createTextNode(''))
  const shadesCSSNode = styleNode.appendChild(document.createTextNode(''))
  const shadowCSSNode = styleNode.appendChild(document.createTextNode(''))

  subscribe(
    ([color, mode, vibrancy]) => {
      const hue = getHue(color)

      colorCSSNode.nodeValue = createCSSVarsNode({
        color: createBaseColor(hue, mode),
        accent: createBaseColor((hue + 120) % MAX_VALUE, mode)
      })

      if (!mode || isNaN(vibrancy)) return

      const shades = createShades(hue, mode)

      shadesCSSNode.nodeValue = createCSSVarsNode(
        Object.entries(shades).reduce((vars, [key, shades]) => {
          vars[`color-${key}`] = shades[vibrancy]

          return vars
        }, {})
      )

      shadowCSSNode.nodeValue = createCSSVarsNode({
        'shadow-01': `0 4px 8px rgba(${hexToRgb(shades[90][vibrancy])},0.25)`
      })
    },
    state => [
      selectColor(state),
      selectMode(state),
      parseInt(selectVibrancy(state), 10)
    ],
    shallow
  )

  // SPACING
  const spacingCSSNode = styleNode.appendChild(document.createTextNode(''))
  subscribe(spacing => {
    spacingCSSNode.nodeValue = createCSSVarsNode({
      'list-item-height': SpacingSettings[spacing][LIST_ITEM_HEIGHT]
    })
  }, selectSpacing)

  // setState(DefaultTheming)

  // DefaultTheming[MODE] = window.matchMedia('(prefers-color-scheme: dark)')
  //   .matches
  //   ? DARK
  //   : LIGHT

  // IndexedDB
  const THEMING_KEY = 'theming'

  // subscribe(
  //   theming => set(THEMING_KEY, theming),
  //   state => ({
  //     [COLOR]: selectColor(state),
  //     [VIBRANCY]: selectVibrancy(state),
  //     [MODE]: selectMode(state),
  //     [SPACING]: selectSpacing(state)
  //   }),
  //   shallow
  // )

  get(THEMING_KEY)
    .then(value => setState({ ...DefaultTheming, ...value }))
    .catch(e => setState(DefaultTheming))
}

export function initializeSimulation () {
  // ZOOM
  let lastZoom = window.devicePixelRatio
  let originalDevicePixel
  window.addEventListener('focus', e => console.log(e.target))
  window.addEventListener('resize', () => {
    if (lastZoom === window.devicePixelRatio) return

    lastZoom = window.devicePixelRatio
    setState({ [ZOOM]: window.devicePixelRatio / originalDevicePixel })
  })

  const key = 'device_pixel'

  get(key).then(devicePixel => {
    originalDevicePixel = devicePixel || lastZoom
    setState({ [ZOOM]: window.devicePixelRatio / originalDevicePixel })
    !devicePixel && set(key, originalDevicePixel)
  })

  runEffect(dyslexia => dyslexia && simulateDyslexia(500), selectDyslexia)

  // Filters
  createFilters()
  const [ghostingSourceBlur, ghostingOverlayBlur] = document.querySelectorAll(
    `#${GHOSTING} feGaussianBlur`
  )
  const ghostingSourceOpacity = document.querySelector(
    `#${GHOSTING} [result='source'] feFuncA`
  )
  const ghostingOffset = document.querySelector(`#${GHOSTING} feOffset`)
  // const ghostingOverlayBlur = document.querySelector(
  //   `#${GHOSTING} feGaussianBlur`
  // )
  const ghostingOverlayOpacity = document.querySelector(
    `#${GHOSTING} [result='overlay'] feFuncA`
  )

  const filtersCSSNode = styleNode.appendChild(document.createTextNode(''))
  subscribe(
    ([blur, brightness, colorblind, contrast, ghosting, opacity, zoom]) => {
      let finalBlur = 0

      blur > DefaultSimulation[BLUR] && (finalBlur += blur)

      if (ghosting > DefaultSimulation[GHOSTING]) {
        // blur
        ghostingSourceBlur.setAttribute(
          'stdDeviation',
          clamp({ value: 0.375 * ghosting, max: 1.25 }) / zoom
        )
        ghostingOverlayBlur.setAttribute(
          'stdDeviation',
          clamp({ value: 0.75 * ghosting, max: 1.75 })
        )

        // opacity
        ghostingSourceOpacity.setAttribute(
          'slope',
          clamp({ value: 1 - ghosting * 0.02, min: 0.85 })
        )
        ghostingOverlayOpacity.setAttribute('slope', ghosting * 0.1)

        // offset
        // ghostingOffset.setAttribute('dx', -ghosting / zoom)
        // ghostingOffset.setAttribute('dy', -(ghosting * 2.5) / zoom)
        ghostingOffset.setAttribute('dx', 1 / zoom)
        ghostingOffset.setAttribute('dy', -ghosting / zoom)

        // background blur
        // finalBlur = blur / (3 * zoom) + 0.25
      }

      if (opacity < DefaultSimulation[OPACITY]) {
        finalBlur += clamp({ value: (100 - opacity) * 0.1, max: 2 })
      }

      const filterValue = joinStrings(
        finalBlur > DefaultSimulation[BLUR] && `blur(${finalBlur / zoom}px)`,
        brightness !== DefaultSimulation[BRIGHTNESS] &&
          `brightness(${brightness}%)`,
        colorblind !== DefaultSimulation[COLORBLIND] && `url('#${colorblind}')`,
        contrast < DefaultSimulation[CONTRAST] && `contrast(${contrast}%)`,
        ghosting > DefaultSimulation[GHOSTING] && `url('#${GHOSTING}')`,
        opacity < DefaultSimulation[OPACITY] && `opacity(${opacity}%)`
      )

      filtersCSSNode.nodeValue = filterValue
        ? `${
            document.getElementById('Figma') ? 'iframe' : 'html'
          }{-webkit-filter:${filterValue};filter:${filterValue};}`
        : ''
    },
    state => [
      parseFloat(state[BLUR]),
      parseFloat(state[BRIGHTNESS]),
      selectColorblind(state),
      parseFloat(state[CONTRAST]),
      parseFloat(state[GHOSTING]),
      parseFloat(state[OPACITY]),
      selectZoom(state)
    ],
    shallow
  )

  // DEVICE
  // fake cursor
  const overlayDivNode = document.createElement('div') // to prevent default click handlers
  overlayDivNode.setAttribute('id', CURSOR_OVERLAY)

  const mouseDivNode = document.createElement('div') // to position fake cursor
  mouseDivNode.setAttribute('id', CURSOR)
  mouseDivNode.innerHTML = renderToStaticMarkup(
    <svg
      fill='none'
      height='32'
      id={CURSOR_SVG}
      viewBox='0 0 32 32'
      width='32'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0.199951 16.9001V0.900146L11.7999 12.5001H4.99995L4.59995 12.6001L0.199951 16.9001Z'
        fill='white'
      />
      <path d='M9.3 17.6L5.7 19.1L1 8L4.7 6.5L9.3 17.6Z' fill='white' />
      <path
        d='M4.87447 9.51852L3.03027 10.2927L6.12707 17.6695L7.97127 16.8953L4.87447 9.51852Z'
        fill='black'
      />
      <path
        d='M1.19995 3.30005V14.5L4.19995 11.6L4.59995 11.5H9.39995L1.19995 3.30005Z'
        fill='black'
      />
    </svg>
  )

  const handleClick = e => {
    overlayDivNode.style.pointerEvents = 'none' // so that elementFromPoint does not return overlay

    const elem = document.elementFromPoint(
      x - window.scrollX,
      y - window.scrollY
    )

    overlayDivNode.style.pointerEvents = 'auto'

    if (!elem || !elem.click) return

    elem.click()
    isFocusable(e.target) && e.target.focus()
  }

  const handleMouseLeave = () => {
    clearInterval(fakeCursorInterval)
    mouseDivNode.style.display = 'none'
  }

  const deviceCSSNode = styleNode.appendChild(document.createTextNode(''))
  runEffect(device => {
    deviceCSSNode.nodeValue = DeviceSettings[device] || ''

    if (device !== HAND_TREMORS) return

    document.body.appendChild(mouseDivNode)
    document.body.appendChild(overlayDivNode)

    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)

    return () => {
      removeChildIfExists(document.body, mouseDivNode)
      removeChildIfExists(document.body, overlayDivNode)

      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeave
      )
      window.removeEventListener('click', handleClick)
    }
  }, selectDevice)

  // trembling
  let x = null // current x position of fake cursor
  let y = null // current y position of fake cursor
  let noiseX = 0
  let noiseY = 0
  let directionX = 1
  let directionY = -1
  let fakeCursorInterval
  let lastHoveredElem

  function shakeMousePosition (currentX, currentY, multiplier) {
    const randomDirectionX = Math.random() * multiplier
    const randomDirectionY = Math.random() * multiplier
    const randomBoundary = 10 * Math.random() * multiplier

    noiseX += directionX
    noiseX >= randomBoundary
      ? (directionX = -randomDirectionX)
      : noiseX <= -randomBoundary && (directionX = randomDirectionX)

    noiseY += directionY
    noiseY >= randomBoundary
      ? (directionY = -randomDirectionY)
      : noiseY <= -randomBoundary && (directionY = randomDirectionY)

    x = currentX + noiseX
    y = currentY - 2 + noiseY
    mouseDivNode.style.cssText = `left:${x}px;top:${y}px;`

    overlayDivNode.style.pointerEvents = 'none' // so that elementFromPoint does not return overlay

    const currentlyHoveredElem = document.elementFromPoint(
      x - window.scrollX,
      y - window.scrollY
    )
    overlayDivNode.style.pointerEvents = 'auto'

    if (currentlyHoveredElem && currentlyHoveredElem !== lastHoveredElem) {
      lastHoveredElem && lastHoveredElem.classList.remove(HOVER_CLASSNAME)
      lastHoveredElem = currentlyHoveredElem
      lastHoveredElem.classList.add(HOVER_CLASSNAME)
    }
  }

  runEffect(
    ([device, intensity, zoom]) => {
      if (device !== HAND_TREMORS) return

      const size = 32 / zoom

      document.getElementById(
        CURSOR_SVG
      ).style.cssText = `height:${size}px;width:${size}px;`

      x = null
      y = null

      const handleMouseMove = e => {
        clearInterval(fakeCursorInterval)

        const currentX = e.pageX
        const currentY = e.pageY
        const multiplier = intensity / zoom

        shakeMousePosition(currentX, currentY, multiplier)

        fakeCursorInterval = setInterval(
          () => shakeMousePosition(currentX, currentY, multiplier),
          clamp({ value: 50 / intensity, max: 8, min: 5 })
        )
      }

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        clearInterval(fakeCursorInterval)
        lastHoveredElem && lastHoveredElem.classList.remove(HOVER_CLASSNAME)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    },
    state => [
      selectDevice(state),
      parseInt(state[TREMBLING_INTENSITY]),
      selectZoom(state)
    ],
    shallow
  )

  let isActive = false
  const toggleKey = 'p'

  window.addEventListener('keydown', e => {
    e.key === toggleKey && (isActive = true)
    isActive && e.key === '0' && resetSimulation()
  })

  window.addEventListener('keyup', e => {
    e.key === toggleKey && (isActive = false)
  })

  loadjQuery()
}

// functional utilities
export function createBaseColor (hue, mode = LIGHT) {
  return hsluvToHex([hue, DEFAULT_SATURATION, ModeSettings[mode][LUMINANCE]])
}

export function createPalette (hue, mode) {
  return EmptyArray.map((_, i) =>
    createBaseColor((hue + (MAX_VALUE * i) / HUE_COUNT) % MAX_VALUE, mode)
  )
}

const LightModes = [LIGHT, LOW_CONTRAST_LIGHT, HIGH_CONTRAST_LIGHT, SPECTRUM]

export function createShades (hue, mode = LIGHT) {
  const luminanceScale = ModeSettings[mode][LUMINANCE_SCALE]
  const keyScale = ModeSettings[mode][KEY_SCALE] || DEFAULT_KEY_SCALE

  return keyScale.reduce((shades, key, i) => {
    key = LightModes.includes(mode) ? 100 - key : key

    shades[key] = SATURATION_SCALE.map(sat =>
      hsluvToHex([hue, sat, luminanceScale[i]])
    )

    return shades
  }, {})
}

export function getHue (color) {
  return hexToHsluv(color)[0]
}

function createFilters () {
  const divNode = document.createElement('div')
  divNode.style.height = 0

  divNode.innerHTML = renderToStaticMarkup(
    <svg height='0' width='0' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        {Object.entries(Colorblind.FilterValues).map(([type, values]) => (
          <filter key={type} id={type}>
            <feColorMatrix
              colorInterpolationFilters='sRGB'
              type='matrix'
              values={values}
            />
          </filter>
        ))}
        <filter colorInterpolationFilters='sRGB' id={GHOSTING}>
          <feGaussianBlur stdDeviation='0' />
          <feComponentTransfer result='source'>
            <feFuncA slope='0' type='linear' />
          </feComponentTransfer>
          <feGaussianBlur in='SourceGraphic' stdDeviation='0' />
          <feOffset dx='0' dy='0' />
          <feComponentTransfer result='overlay'>
            <feFuncA slope='0' type='linear' />
          </feComponentTransfer>
          <feBlend in2='source' mode='multiply' />
        </filter>
        {/* <filter id={GHOSTING}>
          <feOffset dx='0' dy='0' in='SourceGraphic' result='offset' />
          <feBlend in='SourceGraphic' in2='offset' mode='multiply' />
        </filter> */}
      </defs>
    </svg>
  )

  document.body.appendChild(divNode)
}

function loadjQuery () {
  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = '/jquery-3.4.1.slim.min.js'
  document.head.appendChild(script)
}

// hooks
export function useColor () {
  return useThemeStore(selectColor)
}

// export function useMode() {
//   return useThemeStore(selectMode)
// }

// export function usePalette() {
//   return useThemeStore(selectPalette)
// }

export function useDyslexia () {
  return useThemeStore(selectDyslexia)
}

export function useColorblind () {
  return useThemeStore(selectColorblind)
}

export function useZoom () {
  return useThemeStore(selectZoom)
}

export default useThemeStore

// selectors
function selectColor (state) {
  return state[COLOR]
}

function selectVibrancy (state) {
  return state[VIBRANCY]
}

function selectMode (state) {
  return state[MODE]
}

function selectSpacing (state) {
  return state[SPACING]
}

function selectDyslexia (state) {
  return state[DYSLEXIA]
}

function selectColorblind (state) {
  return state[COLORBLIND]
}

function selectDevice (state) {
  return state[DEVICE]
}

function selectZoom (state) {
  return state[ZOOM]
}

// DOM utilities
function removeChildIfExists (parentNode, childNode) {
  parentNode.contains(childNode) && parentNode.removeChild(childNode)
}

function createCSSVarsNode (vars) {
  return (
    Object.entries(vars).reduce((style, [key, value]) => {
      style += `--${key}:${value};`
      return style
    }, ':root{') + '}'
  )
}

const InteractiveElements = [
  'BUTTON',
  // 'DETAILS',
  // 'DIALOG',
  'INPUT',
  'SELECT',
  // 'SUMMARY',
  'TEXTAREA'
]
// const InteractiveRoles = [
//   'button',
//   'link',
//   'checkbox',
//   'menuitem',
//   'menuitemcheckbox',
//   'menuitemradio',
//   'option',
//   'radio',
//   'searchbox',
//   'switch',
//   'textbox'
// ]

// function isInteractive(elem) {
//   const tagName = elem.tagName

//   return (
//     (tagName === 'A' && !!elem.href) ||
//     !!elem.control ||
//     InteractiveElements.includes(tagName) ||
//     InteractiveRoles.includes(elem.getAttribute('role'))
//   )
// }

function isFocusable (elem) {
  const tagName = elem.tagName

  return (
    (tagName === 'A' && !!elem.href) ||
    InteractiveElements.includes(tagName) ||
    !!elem.tabindex
  )
}

// zustand utilities
function cleanUp (listener) {
  let cleanup

  return (...args) => {
    if (typeof cleanup === 'function') {
      cleanup()
    }
    cleanup = listener(...args)
  }
}

// add runEffect, which is similar to React's useLayoutEffect
function withEffect (initial) {
  return (set, get, api) => {
    api.runEffect = (listener, ...rest) =>
      api.subscribe(cleanUp(listener), ...rest)

    return {
      ...initial
    }
  }
}

function shallow (a, b) {
  for (const i in a) {
    if (!Object.is(a[i], b[i])) return false
  }
  return true
}
