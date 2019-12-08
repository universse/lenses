import { clear } from 'idb-keyval'

import { initializeSimulation, initializeTheming } from 'hooks/useThemeStore'
import 'styles/index.scss'

// export { default as wrapRootElement } from './gatsby/wrapRootElement'

export const onClientEntry = () => {
  initializeTheming()
  // clear()
}

export const onInitialClientRender = () => {
  initializeSimulation()
}
