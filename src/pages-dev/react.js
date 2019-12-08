import React from 'react'
// import { css } from '@emotion/core'
import { Simulation } from 'components/Tabs'

export default function ReactPage () {
  return (
    <div
      className='flex justify-center items-center'
      style={{ height: '100vh' }}
    >
      <div>
        <Simulation />
      </div>
    </div>
  )
}
