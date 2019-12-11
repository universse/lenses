import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
// import { css } from '@emotion/core'

import useId, { makeId } from 'hooks/useId'
import {
  DefaultSimulationControls,
  ThemingControls,
  Controls,
  resetSimulation,
  setLense,
  AllLenses
} from 'hooks/useThemeStore'
import classNames from 'utils/classNames'

function renderControls(controls) {
  return controls.map((Control, i) => {
    if (typeof Control === 'function') return <Control key={Control} />

    const [Component, props] = Controls[Control]
    return <Component key={i} themeKey={Control} {...props} />
  })
}

export function Theming() {
  return renderControls(ThemingControls)
}

export function Simulation({ controls = DefaultSimulationControls }) {
  useEffect(() => () => resetSimulation(), [])

  return renderControls(controls)
}

Simulation.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.string.isRequired)
}

const LensesGroupName = 'lenses'

export function Lenses({ lenses = AllLenses }) {
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

export default function Tabs({ tabs }) {
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
