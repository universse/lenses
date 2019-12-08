export const zoomEvent = new Event('zoom')
let lastZoom = window.devicePixelRatio

export default function addZoomEvent () {
  window.addEventListener('resize', () => {
    if (lastZoom !== window.devicePixelRatio) {
      lastZoom = window.devicePixelRatio
      dispatchEvent(zoomEvent)
    }
  })
}
