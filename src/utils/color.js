export {
  toHexKey,
  isValidHex,
  hexToRgb,
  getColorContrast,
  getColorContrastWithFilter
}

function toHexKey(hex) {
  hex = toHex6(hex)
  return isGray(hex) ? '000000' : hex
}

const HEX_REGEXP = /^#?([0-9a-f]{3}){1,2}$/i

function isValidHex(color) {
  return HEX_REGEXP.test(color)
}

console.log(
  rgbToHex(
    rgbWithFilter(
      hexToRgb('#42dead'),
      '0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0'
    )
  )
)

function getColorContrast(hex1, hex2) {
  return getColorContrastWithFilter(hex1, hex2)
}

function getColorContrastWithFilter(hex1, hex2, filterValues = '') {
  if (filterValues) {
    hex1 = rgbToHex(rgbWithFilter(hexToRgb(hex1), filterValues))
    hex2 = rgbToHex(rgbWithFilter(hexToRgb(hex2), filterValues))
  }

  const l1 = luminance(hex1) + 0.05
  const l2 = luminance(hex2) + 0.05

  return Math.max(l1, l2) / Math.min(l1, l2)
}

function hexToRgb(hex) {
  if (!isValidHex(hex)) throw new Error(`Invalid hex ${hex}.`)

  hex = toHex6(hex)

  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16)
  ]
}

function toHex6(hex) {
  hex = hex.replace('#', '')

  hex.length === 3 && (hex = hex.replace(/([0-9a-f])/g, '$1$1'))

  return hex.toLowerCase()
}

function isGray(hex) {
  return new Set(hex).size === 1
}

function luminanceX(x) {
  x /= 255
  return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
}

function rgbToLuminance([r, g, b]) {
  r = luminanceX(r)
  g = luminanceX(g)
  b = luminanceX(b)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function luminance(hex) {
  return rgbToLuminance(hexToRgb(hex))
}

// export function Color(hex) {
//   if (!isValidHex(hex)) {
//     throw new Error('Invalid color!')
//   }

//   const rgb = hexToRgb(hex)

//   return {
//     hex: `#${toHex6(hex)}`,
//     rgb,
//     get luminance() {
//       return rgbToLuminance(rgb)
//     }
//   }
// }

export function clamp({ value, max = +Infinity, min = -Infinity }) {
  if (max < min) {
    throw new Error('Max value should be greater than min value.')
  }
  return Math.max(min, Math.min(max, value))
}

function rgbWithFilter([r, g, b, a = 1], filterValues) {
  return filterValues.split(' ').map((row, i) => {
    const columns = row.split(',')
    const value =
      r * columns[0] +
      g * columns[1] +
      b * columns[2] +
      a * columns[3] +
      1 * columns[4]

    return clamp({
      value: Math.round(value),
      max: 255,
      min: 0
    })
  })
}

function xToHex(x) {
  const hex = x.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

function rgbToHex([r, g, b, a]) {
  return `#${xToHex(r)}${xToHex(g)}${xToHex(b)}`
}
