const { basename } = require('path')

module.exports = ({ actions: { createNodeField }, getNode, node }) => {
  if (node.internal.type === 'Mdx') {
    const componentName = basename(node.fileAbsolutePath, '.mdx')

    createNodeField({
      node,
      name: 'componentName',
      value: componentName
    })
  }
}
