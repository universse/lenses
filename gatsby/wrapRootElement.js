import React from 'react'
import { MDXProvider } from '@mdx-js/react'
// import { preToCodeBlock } from 'mdx-utils'

// import Code from 'components/Code'
import Link from 'components/Link'

const components = {
  a: Link
  // pre: preProps => {
  //   const props = preToCodeBlock(preProps)
  //   return props ? <Code {...props} /> : <pre {...preProps} />
  // }
}

export default function wrapRootElement ({ element }) {
  return <MDXProvider components={components}>{element}</MDXProvider>
}
