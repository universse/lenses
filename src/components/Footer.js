import React from 'react'
import { Link } from 'gatsby'

import useSiteMetadata from 'hooks/useSiteMetadata'

export default function Footer () {
  const { title } = useSiteMetadata()

  return (
    <footer>
      <div>
        <span>
          © {new Date().getFullYear()},{' '}
          <Link to='/'>{title.toLowerCase()}.now.sh</Link>
        </span>
      </div>
    </footer>
  )
}
