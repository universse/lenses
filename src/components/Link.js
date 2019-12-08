import React from 'react'
import { Link as GatsbyLink } from 'gatsby'

export default function Link ({ href, to, ...props }) {
  if (to && !href) href = to
  return /^\/(?!\/)/.test(href) ? (
    <GatsbyLink to={href} {...props} />
  ) : (
    <a href={href} {...props} />
  )
}
