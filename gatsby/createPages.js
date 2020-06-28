// const { resolve } = require('path')
// const System = require('@phuocsss/system')

module.exports = ({ actions: { createPage, createRedirect } }) => {
  if (process.env.NETLIFY) {
    createRedirect({
      fromPath: '/fire/*',
      toPath: `${process.env.FIREBASE_FUNCTIONS}/:splat`,
      statusCode: 200,
    })

    createRedirect({
      fromPath: '/*',
      toPath: '/figma',
      statusCode: 200,
    })
  } else {
    createRedirect({
      fromPath: '/fire/(.*)',
      toPath: `${process.env.FIREBASE_FUNCTIONS}/$1`,
      statusCode: 200,
    })

    createRedirect({
      fromPath: '/(.*)',
      toPath: '/figma',
      statusCode: 200,
    })
  }

  // Object.keys(System).forEach(componentName => {
  //   createPage({
  //     path: `/${componentName.toLowerCase()}`,
  //     component: resolve('./src/templates/component.js'),
  //     context: {
  //       componentName
  //     }
  //   })
  // })
}
