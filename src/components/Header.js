import React from 'react'
import { Link } from 'gatsby'

import Logo from './Logo'

export default function Header () {
  return (
    <header>
      <div>
        <Link to='/'>
          <Logo />
        </Link>
      </div>
    </header>
  )
}
