import React from 'react'
import PropTypes from 'prop-types'

import Footer from 'components/Footer'
import Header from 'components/Header'
import SEO from 'components/SEO'
import SideNav from 'components/SideNav'
import Tabs, { Theming, Simulation, Lenses } from 'components/Tabs'

const tabs = [
  { tab: 'theming', Panel: Theming },
  { tab: 'simulation', Panel: Simulation },
  { tab: 'lenses', Panel: Lenses }
]

export default function Layout ({ children, location: { pathname } }) {
  return (
    <>
      <SEO />
      {pathname.startsWith('/figma') || pathname.startsWith('/react') ? (
        children
      ) : (
        <>
          <div className='View'>
            <div className='SideNav'>
              <Header />
              <nav>
                <SideNav />
              </nav>
            </div>
            <main
              className='w-100 mt-32'
              id='main'
              style={{ maxWidth: '48rem' }}
            >
              {children}
            </main>
            <div className='ThemingSidebar'>
              <Tabs tabs={tabs} />
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired
}
