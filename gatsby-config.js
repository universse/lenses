const config = {
  siteMetadata: {
    title: 'Through Another Lens',
    shortTitle: 'Lenses',
    description: 'Invisible Worlds'
  },
  plugins: [
    {
      resolve: 'gatsby-theme-essentials',
      options: {
        // enableWorkerize: true,
        enableAnalytics: {
          endpoint: '/fire/int',
          appId: 'figma'
        },
        enablePagesDev: true,
        // enablePreloadFonts: true,
        enableManifest: {
          name: 'Lenses',
          short_name: 'Lenses',
          start_url: '/figma',
          background_color: '#276ac1',
          theme_color: '#276ac1',
          display: 'standalone'
          // icon: 'src/images/icon.png' // This path is relative to the root of the site.
        }
      }
    },
    'gatsby-plugin-layout',
    // 'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: `${__dirname}/src/docs`
      }
    },
    {
      resolve: 'gatsby-transformer-json',
      options: {
        typeName: ({ node, object, isArray }) => {
          if (object.componentName) return 'info'
        }
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        defaultLayouts: {},
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 672
            }
          }
        ]
      }
    }
  ]
}

module.exports = config
