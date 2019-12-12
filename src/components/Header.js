import React from 'react'
import { Link } from 'gatsby'

import Logo from './Logo'

export default function Header () {
  return (
    <header style={{ height: '6rem' }}>
      <div>
        <Link to='/'>
          <Logo />
        </Link>
      </div>
    </header>
  )
}
