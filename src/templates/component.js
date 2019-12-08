// import React from 'react'
// import PropTypes from 'prop-types'
// import { MDXRenderer } from 'gatsby-plugin-mdx'

// import ComponentInfo from 'components/ComponentInfo'

// import { graphql } from 'gatsby'

// export default function ComponentTemplate({
//   pageContext: { componentName },
//   data: { mdx, info }
// }) {
//   return (
//     <>
//       <h1>{componentName}</h1>
//       <ComponentInfo info={JSON.parse(info.data)} />
//       {mdx && <MDXRenderer>{mdx.body}</MDXRenderer>}
//     </>
//   )
// }

// ComponentTemplate.propTypes = {
//   data: PropTypes.shape({
//     info: PropTypes.shape({ data: PropTypes.string }).isRequired,
//     mdx: PropTypes.shape({ body: PropTypes.string })
//   }).isRequired,
//   pageContext: PropTypes.shape({
//     componentName: PropTypes.string.isRequired
//   }).isRequired
// }

// export const query = graphql`
//   query($componentName: String!) {
//     mdx(fields: { componentName: { eq: $componentName } }) {
//       body
//     }

//     info(componentName: { eq: $componentName }) {
//       data
//     }
//   }
// `
