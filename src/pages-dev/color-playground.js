import React, { useState, useEffect, useRef, forwardRef } from 'react'
import create from 'zustand'
import { get, set } from 'idb-keyval'
import produce from 'immer'
import { hexToHsluv, hsluvToHex } from 'hsluv'

import {
  BRAND_COLOR,
  LIGHT,
  DARK,
  HIGH_CONTRAST,
  SPECTRUM,
  getHue
} from 'hooks/useThemeStore'
import { getColorContrast, hexToRgb, isValidHex, toHexKey } from 'utils/color'

// a11y getColorContrast
// export
// loading jump
// table header
// style controls
// click to copy
// error

const DefaultPalette = {
  byId: {},
  allIds: [BRAND_COLOR.replace('#', '')]
}

const [useShadeStore, { setState, subscribe }] = create(() => ({
  byId: {},
  allIds: []
}))

const lightness = [6, 17, 28, 39, 50, 61, 72, 83, 94]
const keyScale = [10, 20, 30, 40, 50, 60, 70, 80, 90]
const BLACK = '000000'

function createShades (hexKey) {
  const hex = `#${hexKey}`
  const hue = hexKey === BLACK ? 0 : getHue(hex)
  const sat = hexKey === BLACK ? 0 : 95

  return lightness.reduce((shades, l, i) => {
    shades[keyScale[i]] = [hue, sat, l]
    return shades
  }, {})
}

const setPalette = fn => setState(produce(fn))

const key = 'palette'

function initialize () {
  subscribe(state => {
    set(key, state)
  })

  subscribe(
    allIds => {
      setPalette(state => {
        allIds.forEach(id => {
          if (state.byId[id]) return

          state.byId[id] = createShades(id)
        })
      })
    },
    state => state.allIds
  )

  return get(key).then(value =>
    setState(value && value.allIds.length ? value : DefaultPalette)
  )
}

function getValue ({ min, max, value }) {
  return Math.max(min, Math.min(max, parseInt(value || 0, 10)))
}

function getCurrentValue (value) {
  value = `${Math.round(value)}`
  return value.length > 1 ? value.replace(/^0/, '') : value
}

const hsluvRanges = [
  { max: 360, min: 0 },
  { max: 100, min: 0 },
  { max: 100, min: 0 }
]

const params = ['hue', 'saturation', 'lightness']

function Shades ({ defaultShades, hexKey }) {
  const shades = useShadeStore(state => state.byId[hexKey]) || defaultShades

  return (
    <ul className='Shades'>
      {shades &&
        Object.entries(shades)
          .reverse()
          .map(([key, hsluv]) => {
            const hex = hsluvToHex(hsluv)

            return (
              <li key={key} className='flex items-center'>
                <div className='mr-32' style={{ flexBasis: '3rem' }}>
                  <div
                    className='rounded'
                    style={{
                      backgroundColor: hex,
                      height: '3rem'
                    }}
                  />
                </div>
                <div className='mr-4' style={{ flexBasis: 'auto' }}>
                  <span>hsl</span>
                </div>
                {hsluv.map((value, i) => (
                  <div
                    key={i}
                    className={`mr-${i === 2 ? 24 : 8}`}
                    style={{ flexBasis: '2.5rem' }}
                  >
                    <input
                      aria-label={`Change ${
                        params[i]
                      } for key ${key} of #${hexKey}`}
                      className='fs-16 text-center h-100 w-100'
                      disabled={!!defaultShades}
                      onChange={e =>
                        setPalette(state => {
                          state.byId[hexKey][key][i] = getValue({
                            ...hsluvRanges[i],
                            value: e.target.value
                          })
                        })
                      }
                      step='1'
                      type='number'
                      value={getCurrentValue(value)}
                      {...hsluvRanges[i]}
                    />
                  </div>
                ))}
                <div className='mr-24' style={{ flexBasis: 'auto' }}>
                  <span>{hex}</span>
                </div>
                <span>rgb({hexToRgb(hex).join(',')})</span>
              </li>
            )
          })}
    </ul>
  )
}

const Input = forwardRef(({ reviewHex, ...props }, ref) => {
  return (
    <>
      <div className='mb-8 w-100'>
        <div
          className='Review rounded-8'
          style={{
            backgroundColor: `#${reviewHex}`,
            height: '6rem'
          }}
        />
      </div>
      <div className='relative mb-12'>
        <div className='flex items-center fs-20 absolute h-100'>#</div>
        <input
          ref={ref}
          className='fs-16 text-center w-100'
          placeholder={BLACK}
          spellCheck={false}
          type='text'
          {...props}
        />
      </div>
    </>
  )
})

function Edit ({ hexKey, index }) {
  const paletteIds = useShadeStore(state => state.allIds)

  const [text, setText] = useState(hexKey)
  const [error, setError] = useState('')

  // const inputRef = useRef()
  const lastValidHex = useRef()

  // useEffect(() => {
  //   inputRef.current.focus()
  // }, [index])

  const inputHexKey = isValidHex(text) && toHexKey(text)

  useEffect(() => {
    inputHexKey && (lastValidHex.current = inputHexKey)
  }, [inputHexKey])

  const commit = () => {
    setPalette(state => {
      delete state.byId[hexKey]
      state.allIds.splice(index, 1, inputHexKey)
    })
    setText(inputHexKey)
  }

  const validate = () => {
    if (inputHexKey === hexKey) {
      setText(inputHexKey)
      return false
    }

    if (!inputHexKey) {
      setError('invalid')
      return false
    }

    if (paletteIds.includes(inputHexKey)) {
      setError('duplicated')
      return false
    }

    return true
  }

  const reviewHex = inputHexKey || lastValidHex.current || hexKey

  return (
    <div className='Edit flex flex-col items-center justify-center'>
      <Input
        // ref={inputRef}
        aria-label='Edit color'
        onBlur={validate}
        onChange={e => setError('') || setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && validate() && commit()}
        reviewHex={reviewHex}
        value={text}
      />
      <div className='flex justify-between w-100'>
        <div>
          <button onClick={() => validate() && commit()} type='button'>
            ok
          </button>
          <button onClick={() => setText(hexKey)} type='button'>
            reset
          </button>
        </div>
        <button
          onClick={() =>
            setPalette(state => {
              delete state.byId[hexKey]
              state.allIds.splice(index, 1)
            })
          }
          type='button'
        >
          delete
        </button>
      </div>
    </div>
  )
}

function Add () {
  const paletteIds = useShadeStore(state => state.allIds)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const lastValidHex = useRef(BLACK)

  const inputHexKey = isValidHex(text) && toHexKey(text)

  useEffect(() => {
    inputHexKey && (lastValidHex.current = inputHexKey)
  }, [inputHexKey])

  const reviewHex = inputHexKey || lastValidHex.current || BLACK

  return (
    <>
      <div className='Add flex flex-col items-center justify-center'>
        <Input
          aria-label='Add a color'
          onBlur={() => {
            if (!inputHexKey) {
              setError('invalid')
              return
            }

            if (paletteIds.includes(inputHexKey)) {
              setError('duplicated')
              return
            }

            setPalette(state => {
              state.allIds.push(inputHexKey)
            })

            setText('')
            lastValidHex.current = BLACK
          }}
          onChange={e => setError('') || setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.target.blur()}
          reviewHex={reviewHex}
          value={text}
        />
      </div>
      <Shades defaultShades={createShades(reviewHex)} />
    </>
  )
}

export default function ColorPlaygroundPage () {
  useEffect(() => {
    initialize()
  }, [])

  const paletteIds = useShadeStore(state => state.allIds)

  return (
    <div className='ColorPlayground'>
      <ul>
        {paletteIds.map((id, i) => (
          <li key={i} className='flex mb-48'>
            <Edit hexKey={id} index={i} />
            <Shades hexKey={id} />
          </li>
        ))}
      </ul>
      <div className='flex'>
        <Add />
      </div>
    </div>
  )
}
