import React, { useEffect, useState } from 'react'
import { Link, navigate } from 'gatsby'
// import { css } from '@emotion/core'
import Tabs, { Simulation, Lenses } from 'components/Tabs'

import Icon from 'components/Icon'
import useDebouncedValue from 'hooks/useDebouncedValue'
import useSiteMetadata from 'hooks/useSiteMetadata'
import { FigmaSimulationControls, FigmaLenses } from 'hooks/useThemeStore'

const FIGMA_REGEXP = /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/
const isFigma = url => url.match(FIGMA_REGEXP) || []

const NAME = 'share'

const SAMPLE_URL =
  'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File'

const PROTO = 'proto'
const FILE = 'file'
// 'https://www.figma.com/proto/MVuVGa6uvlRX1j6TdN0catmn/BMS?node-id=23%3A331&scaling=scale-down'
// when share need to encodeURIComponent
// store history
// responsive
// fixed

const tabs = [
  { tab: 'lenses', Panel: Lenses, props: { lenses: FigmaLenses } },
  {
    tab: 'simulation',
    Panel: Simulation,
    props: { controls: FigmaSimulationControls }
  }
]

export default function FigmaPage({ location: { search } }) {
  const [url, setUrl] = useState(() => new URLSearchParams(search).get('url'))
  const debouncedUrl = useDebouncedValue(url, 500)
  const { shortTitle } = useSiteMetadata()

  const decodedDebouncedUrl = decodeURIComponent(debouncedUrl)

  const [, , type] = isFigma(decodedDebouncedUrl)

  useEffect(() => {
    const url =
      debouncedUrl && type
        ? `/figma?url=${encodeURIComponent(debouncedUrl)}`
        : '/figma'

    navigate(url)
  }, [debouncedUrl, type])

  return (
    <div className='flex flex-col' id='Figma'>
      <header>
        <div className='relative justify-center'>
          <div className='absolute' style={{ left: '13px' }}>
            <Link className='color-white' to='/figma'>
              {shortTitle}
            </Link>
          </div>
          <div className='InputWrapper relative h-100'>
            <div
              className='absolute flex items-center h-100'
              style={{ color: '#000', top: '-0.0625rem' }}
            >
              <Icon icon='figma' size='medium' />
            </div>
            <input
              aria-label='Figma URL'
              className='h-100 w-100'
              onChange={e => setUrl(e.target.value)}
              placeholder={SAMPLE_URL}
              type='text'
              value={type && decodeURIComponent(url)}
            />
          </div>
          <div className='absolute flex items-center h-100'>
            <details>
              <summary className='color-white flex items-center fs-14'>
                <div style={{ height: 24 }}>
                  <Icon icon='lens' />
                </div>
                <span>Simulation</span>
                <div className='ml-4' style={{ height: '1.25rem' }}>
                  <Icon icon='chevron-down' size='medium' />
                </div>
              </summary>
              <div className='absolute right-0 rounded-4'>
                <Tabs tabs={tabs} />
              </div>
            </details>
          </div>
        </div>
      </header>
      <main>
        <iframe
          height='100%'
          // allowFullScreen
          src={`https://www.figma.com/embed?embed_host=${NAME}&url=${
            type ? decodedDebouncedUrl : SAMPLE_URL
          }`}
          style={{ border: 0 }}
          title='Figma Embed'
          width='100%'
        />
      </main>
    </div>
  )
}
