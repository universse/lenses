import React from 'react'

import {
  PaletteSlider,
  // COLOR,
  SPECTRUM,
  // createBaseColor,
  createPalette,
  createShades,
  getHue,
  // setTheme,
  useColor,
  // usePalette,
  useColorblind
} from 'hooks/useThemeStore'

import Colorblind from 'constants/Colorblind'
import { getColorContrastWithFilter } from 'utils/color'

const WHITE = '#fff'
const BLACK = '#000'

export default function PalettePage () {
  // const palette = usePalette()
  const colorblind = useColorblind()
  const filterValues = Colorblind.FilterValues[colorblind]

  const color = useColor()
  const hue = getHue(color)

  return (
    <div>
      <div className='PalettePage sticky flex top-0 items-center'>
        <PaletteSlider />
      </div>
      <ul className='Palette'>
        {createPalette(hue).map(color => {
          const spectrum = createShades(getHue(color), SPECTRUM)

          return (
            <li key={color}>
              <ul>
                {Object.entries(spectrum).map(([luminance, shades]) => (
                  <li key={shades[0]}>
                    <ul>
                      {shades.map(shade => (
                        <li key={shade} style={{ backgroundColor: shade }}>
                          <span
                            style={{
                              color: luminance > 50 ? WHITE : BLACK
                            }}
                          >
                            {Math.round(
                              getColorContrastWithFilter(
                                shade,
                                luminance > 50 ? WHITE : BLACK,
                                filterValues
                              ) * 100
                            ) / 100}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
