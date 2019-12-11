import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import useSiteMetadata from 'hooks/useSiteMetadata'

function SEO({ description, lang = 'en', meta = [], title }) {
  const siteMetadata = useSiteMetadata()
  const metaDescription = description || siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      meta={[
        {
          name: 'description',
          content: metaDescription
        },
        {
          property: 'og:title',
          content: title || siteMetadata.title
        },
        {
          property: 'og:description',
          content: metaDescription
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:title',
          content: title || siteMetadata.title
        },
        {
          name: 'twitter:description',
          content: metaDescription
        },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'default'
        }
      ].concat(meta)}
      title={
        title
          ? `${title} | ${siteMetadata.shortTitle}`
          : `${siteMetadata.title} | ${siteMetadata.description}`
      }
    />
  )
}

export default memo(SEO)

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  title: PropTypes.string
}
