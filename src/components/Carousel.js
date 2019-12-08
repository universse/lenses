import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { wrap } from '@popmotion/popcorn'
import { css } from '@emotion/core'

const swipeThreshold = 10000

function calculateSwipePower (offset, velocity) {
  return Math.abs(offset) * velocity
}

const variants = {
  enter: direction => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  }
}

// props
const images = [
  {
    id: 'a',
    src:
      'https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png'
  },
  {
    id: 'b',
    src:
      'https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png'
  },
  {
    id: 'c',
    src:
      'https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png'
  },
  {
    id: 'd',
    src:
      'https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png'
  },
  {
    id: 'e',
    src:
      'https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png'
  },
  {
    id: 'f',
    src:
      'https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png'
  }
]

const SLIDES_TO_SHOW = 2
const SLIDES_TO_SCROLL = 1
const ADDITIONAL_SLIDE_COUNT = SLIDES_TO_SHOW * SLIDES_TO_SCROLL

const cloneStart = images
  .slice(-ADDITIONAL_SLIDE_COUNT)
  .map(image => ({ ...image, originalId: image.id }))
const cloneEnd = images
  .slice(0, ADDITIONAL_SLIDE_COUNT)
  .map(image => ({ ...image, originalId: image.id }))

const marginX = 4

// states

const INITIAL = 'initial'
const IDLE = 'idle'
const TRANSITIONING = 'transitioning'
const REBASING = 'rebasing'

const END = 'end'
const PAGINATE = 'paginate'
const REBASE = 'rebase'

const defaultProps = {
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1
}

const stateMachine = {
  initialState: INITIAL,
  states: {
    [INITIAL]: {
      on: {
        [PAGINATE]: TRANSITIONING
      }
    },
    [IDLE]: {
      on: {
        [PAGINATE]: TRANSITIONING,
        [REBASE]: REBASING
      }
    },
    [TRANSITIONING]: {
      on: {
        [END]: IDLE
      }
    },
    [REBASING]: {
      on: {
        [END]: IDLE
      }
    }
  }
}

function reducer (currentState, { action, originalId, direction }) {
  const { state, slides, currentIndex } = currentState
  const nextState = stateMachine.states[state].on[action]

  if (!nextState) return currentState

  if (originalId) {
    const originalIndex = slides.findIndex(
      image => !image.originalId && image.id === originalId
    )
    return { state: nextState, currentIndex: originalIndex, slides }
  }

  return {
    state: nextState,
    currentIndex:
      wrap(0, slides.length, currentIndex + direction * SLIDES_TO_SCROLL) ||
      currentIndex,
    slides
  }
}

// props
// responsive

export default function ImageSlider ({
  isCentered,
  slidesToShow,
  slidesToScroll
}) {
  const additionalSlideCount = slidesToShow * slidesToShow

  const [{ state, currentIndex, slides }, dispatch] = useReducer(reducer, {
    state: stateMachine.initialState,
    currentIndex: ADDITIONAL_SLIDE_COUNT,
    slides: [...cloneStart, ...images, ...cloneEnd]
  })

  const originalId = slides[currentIndex].originalId

  useEffect(() => {
    if (state === TRANSITIONING) {
      setTimeout(() => dispatch({ action: END }), 350)
    } else if (state === REBASING) {
      setTimeout(() => dispatch({ action: END }), 50)
    }
  }, [state])

  useEffect(() => {
    if (originalId && state === IDLE) dispatch({ action: REBASE, originalId })
  }, [originalId, state])

  const [width, setWidth] = useState(0)

  function handleDragEnd (e, { offset, velocity }) {
    const swipePower = calculateSwipePower(offset.x, velocity.x)

    if (swipePower < -swipeThreshold) {
      dispatch({ action: PAGINATE, direction: -1 })
    } else if (swipePower > swipeThreshold) {
      dispatch({ action: PAGINATE, direction: 1 })
    }
  }

  return (
    <div className='Carousel'>
      <ul
        css={css`
          transform: translateX(-${width ? width * (currentIndex - 0.5) : 0}px);
          transition: transform
            ${state === REBASING || state === INITIAL ? 0 : 0.35}s ease-in-out;
        `}
      >
        {slides.map(({ id, src }, i) => (
          <li
            key={i}
            css={css`
              flex: 1 0 calc(50% - ${2 * marginX}px);
              margin: 0 ${marginX}px;
            `}
          >
            <img
              alt=''
              onLoad={e => !width && setWidth(e.target.width + 2 * marginX)}
              src={src}
            />
          </li>
        ))}
      </ul>
      {!!width && (
        <>
          <button
            onClick={() => dispatch({ action: PAGINATE, direction: -1 })}
            style={{ left: 0 }}
          >
            Left
          </button>
          <button
            onClick={() => dispatch({ action: PAGINATE, direction: 1 })}
            style={{ right: 0 }}
          >
            Right
          </button>
        </>
      )}
    </div>
  )
}
