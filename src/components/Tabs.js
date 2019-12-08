import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
// import { css } from '@emotion/core'
// import rafSchd from 'raf-schd'

import useId, { makeId } from 'hooks/useId'
import useThemeStore, {
  COLOR,
  VIBRANCY,
  MODE,
  SPACING,
  DYSLEXIA,
  COLORBLIND,
  BLUR,
  BRIGHTNESS,
  CONTRAST,
  GHOSTING,
  OPACITY,
  DEVICE,
  TREMBLING_INTENSITY,
  AllKeys,
  Options,
  createBaseColor,
  getHue,
  setTheme,
  setLense,
  resetSimulation,
  useColor,
  AllLenses
} from 'hooks/useThemeStore'
import classNames from 'utils/classNames'

const title = 'fs-13 lh-16 capitalize fw-700'

// const schedule = rafSchd((hue) =>
//   // TODO may get stuck when use keyboard
//   setTheme({
//     [COLOR]: createBaseColor(hue)
//   })
// )

export function PaletteSlider () {
  const color = useColor()
  const hue = getHue(color)

  return (
    <Slider
      className='PaletteSlider'
      max='359.99999999999999'
      min='0'
      // onChange={e => schedule(e.target.value)}
      onChange={e => setTheme({ [COLOR]: createBaseColor(e.target.value) })}
      themeKey={COLOR}
      value={hue}
    />
  )
}

export function Theming () {
  return (
    <>
      <PaletteSlider />
      <Slider max='9' min='0' themeKey={VIBRANCY} />
      <RadioGroup themeKey={MODE} />
      <RadioGroup themeKey={SPACING} />
    </>
  )
}

const FigmaControls = [
  COLORBLIND,
  BLUR,
  CONTRAST,
  GHOSTING,
  OPACITY,
  BRIGHTNESS
]

const SimulationUI = {
  Default: (
    <>
      <RadioGroup themeKey={COLORBLIND} />
      <Slider className='rtl' max='5' min='-5' step='0.1' themeKey={BLUR} />
      <Slider max='185' min='15' themeKey={CONTRAST} />
      <Slider max='8' min='-8' step='0.1' themeKey={GHOSTING} />
      <Slider className='rtl' max='185' min='15' themeKey={OPACITY} />
      <Slider max='400' min='100' step='10' themeKey={BRIGHTNESS} />
    </>
  ),
  NonFigma: (
    <>
      <div className='mb-8 mt-12'>
        <h3 className={title}>Cognition</h3>
      </div>
      <Switch themeKey={DYSLEXIA} />
      <RadioGroup themeKey={DEVICE} />
      <Slider max='12' min='3' step='1' themeKey={TREMBLING_INTENSITY} />
    </>
  )
}

export function Simulation ({ isFigma = false, controls }) {
  useEffect(() => {
    return () => {
      resetSimulation()
    }
  }, [])

  return (
    <>
      {SimulationUI.Default}
      {!isFigma && SimulationUI.NonFigma}
    </>
  )
}

Simulation.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.string.isRequired)
}

const LensesGroupName = 'lenses'

export function Lenses ({ lenses = AllLenses }) {
  return (
    <div aria-labelledby={LensesGroupName} className='mt-12' role='group'>
      <div className='mb-8 visually-hidden'>
        <h3 id={LensesGroupName}>{LensesGroupName.split('--').join(' ')}</h3>
      </div>
      <div>
        {lenses.map((lense, i) => {
          const optionId = `lense-${lense}`

          return (
            <div
              key={lense}
              className={classNames(i !== lenses.length - 1 && 'mb-8')}
            >
              <input
                className='Radio visually-hidden'
                defaultChecked={i === 0}
                id={optionId}
                name={LensesGroupName}
                onChange={() => setLense(lense)}
                type='radio'
              />
              <label
                className='flex items-center relative capitalize fs-13 lh-16'
                htmlFor={optionId}
              >
                {lense.split('--').join(' ')}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

Lenses.propTypes = {
  lenses: PropTypes.arrayOf(PropTypes.string.isRequired)
}

const TAB = 'tab'
const TAB_PANEL = 'tabpanel'

export default function Tabs ({ tabs }) {
  const id = useId()
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  const userInteracted = useRef(false)

  const onSelect = e => {
    userInteracted.current = true
    setCurrentTabIndex(e.target.value)
  }

  const tabCount = tabs.length

  useEffect(() => {
    userInteracted.current &&
      document.getElementById(makeId(TAB, id, currentTabIndex)).focus()
  }, [currentTabIndex, id])

  return (
    <div className='Tabs'>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        className='flex mb-8'
        onKeyDown={e => {
          userInteracted.current = true

          switch (e.key) {
            case 'ArrowRight':
              setCurrentTabIndex(
                currentTabIndex => (currentTabIndex + 1) % tabCount
              )
              break

            case 'ArrowLeft':
              setCurrentTabIndex(
                currentTabIndex => (tabCount + currentTabIndex - 1) % tabCount
              )
              break
          }
        }}
        role='tablist'
      >
        {tabs.map(({ tab }, i) => {
          // eslint-disable-next-line eqeqeq
          const isSelected = currentTabIndex == i

          return (
            <div key={tab} className='mr-8'>
              <button
                aria-controls={makeId(TAB_PANEL, id, i)}
                aria-selected={isSelected}
                className={classNames(
                  'fs-13 uppercase',
                  isSelected && 'fw-700'
                )}
                id={makeId(TAB, id, i)}
                onClick={onSelect}
                role={TAB}
                style={{
                  height: '1.25rem',
                  borderBottom: `2px solid ${
                    isSelected ? 'var(--text-primary)' : 'transparent'
                  }`
                }}
                tabIndex={isSelected ? 0 : -1}
                type='button'
                value={i}
              >
                {tab}
              </button>
            </div>
          )
        })}
      </div>
      {tabs.map(({ tab, Panel, props }, i) => (
        <div
          key={tab}
          aria-labelledby={makeId(TAB, id, i)}
          // eslint-disable-next-line eqeqeq
          hidden={currentTabIndex != i}
          id={makeId(TAB_PANEL, id, i)}
          role={TAB_PANEL}
          // tabIndex='0'
        >
          <Panel {...props} />
        </div>
      ))}
    </div>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.exact({
      tab: PropTypes.string.isRequired,
      Panel: PropTypes.elementType.isRequired,
      props: PropTypes.object
    }).isRequired
  ).isRequired
}

function RadioGroup ({ themeKey, children }) {
  const value = useThemeStore(state => state[themeKey])
  const onChange = e => setTheme({ [themeKey]: e.target.value })

  return (
    <div aria-labelledby={themeKey} className='mb-12 mt-8' role='group'>
      <div className='mb-8'>
        <h3 className={title} id={themeKey}>
          {themeKey.split('--').join(' ')}
        </h3>
      </div>
      <div>
        {Options[themeKey].map(option => {
          const optionId = `theme-${themeKey}-${option}`

          return (
            <div key={option} className='mb-8'>
              <input
                checked={option === value}
                className='Radio visually-hidden'
                id={optionId}
                name={themeKey}
                onChange={onChange}
                type='radio'
                value={option}
              />
              <label
                className='flex items-center relative capitalize fs-13 lh-16'
                htmlFor={optionId}
              >
                {option.split('--').join(' ')}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

RadioGroup.propTypes = {
  themeKey: PropTypes.oneOf(AllKeys).isRequired
  // children: PropTypes.node
}

function Switch ({ themeKey }) {
  const value = useThemeStore(state => state[themeKey])
  const labelledBy = `${themeKey}-label`

  return (
    <div className='flex items-center justify-between mb-12'>
      <span className='capitalize fs-13 lh-16' id={labelledBy}>
        {themeKey.split('--').join(' ')}
      </span>
      <div className='inline-block'>
        <input
          aria-labelledby={labelledBy}
          checked={value}
          className='Switch visually-hidden'
          id={themeKey}
          onChange={e => setTheme({ [themeKey]: e.target.checked })}
          type='checkbox'
        />
        <label className='flex items-center rounded' htmlFor={themeKey} />
      </div>
    </div>
  )
}

Switch.propTypes = {
  themeKey: PropTypes.string.isRequired
}

function Slider ({ themeKey, className, ...props }) {
  const value = useThemeStore(state => state[themeKey])
  const label = themeKey.split('--').join(' ')

  return (
    <div className='mb-4 mt-8'>
      <h3 className={title}>{label}</h3>
      <input
        aria-label={`Adjust ${label}.`}
        className={classNames('Slider', className)}
        onChange={e =>
          setTheme({
            [themeKey]: e.target.value
          })
        }
        step='1'
        type='range'
        value={value}
        {...props}
      />
    </div>
  )
}

Slider.propTypes = {
  max: PropTypes.string.isRequired,
  min: PropTypes.string.isRequired,
  themeKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool
}

// function Option(props) {
//   const { id, value } = props

//   return (
//     <div className='mb-8'>
//       <input className='Radio visually-hidden' type='radio' {...props} />
//       <label
//         className='flex items-center relative capitalize fs-13 lh-16'
//         htmlFor={id}
//       >
//         {value.split('--').join(' ')}
//       </label>
//     </div>
//   )
// }

// // function ColorOption(props) {
// //   const { id, value } = props

// //   return (
// //     <div className='ColorOption relative mr-8'>
// //       <input className='Color visually-hidden' type='radio' {...props} />
// //       <label
// //         css={css`
// //           &::before {
// //             background-color: ${value};
// //           }
// //         `}
// //         htmlFor={id}
// //       >
// //         {value}
// //       </label>
// //     </div>
// //   )
// // }

// const OptionType = {
//   checked: PropTypes.bool.isRequired,
//   id: PropTypes.string.isRequired,
//   name: PropTypes.oneOf(AllKeys).isRequired,
//   onChange: PropTypes.func.isRequired,
//   value: PropTypes.string.isRequired
// }

// Option.propTypes = OptionType
// // ColorOption.propTypes = OptionType

// function RadioGroup({ id, children }) {
//   return (
//     <div className='mb-12 mt-8' role='group'>
//       <div aria-labelledby={id} className='mb-8'>
//         <h3 className={title} id={id}>
//           {id.split('-').join(' ')}
//         </h3>
//       </div>
//       {children}
//     </div>
//   )
// }

// RadioGroup.propTypes = {
//   children: PropTypes.node.isRequired,
//   id: PropTypes.oneOf(AllKeys).isRequired
// }

// function ThemingOptions({ themeKey }) {
//   const value = useThemeStore(state => state[themeKey])
//   const onChange = e => setTheme({ [themeKey]: e.target.value })

//   return Options[themeKey].map(option => (
//     <Option
//       key={option}
//       checked={option === value}
//       id={`theme-${themeKey}-${option}`}
//       name={themeKey}
//       onChange={onChange}
//       value={option}
//     />
//   ))
// }

// ThemingOptions.propTypes = {
//   // Option: PropTypes.elementType.isRequired,
//   themeKey: PropTypes.string.isRequired
// }
