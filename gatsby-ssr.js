import React from 'react'

export const onRenderBody = ({ setHeadComponents }) => {
  const headComponents = []

  if (process.env.NODE_ENV === 'production') {
    headComponents.push(
      <script
        key='devtools'
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
              for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
                window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value == "function" ? () => {} : null;
              }
            }
          `
        }}
      />
    )
  }

  setHeadComponents(headComponents)
}

export const wrapPageElement = () => {
  return null
}

// export { default as wrapRootElement } from './gatsby/wrapRootElement'
