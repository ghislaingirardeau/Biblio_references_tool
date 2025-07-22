import { useBreakpoints, useScreenOrientation, useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

export const breakpoints = useBreakpoints({
  mobile: 0,
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})
const { height } = useWindowSize()
const { orientation } = useScreenOrientation()

export function useIsMobile() {
  return breakpoints.active().value === 'mobile' ||
    breakpoints.active().value === 'tablet' ||
    hasTouchEvent()
    ? true
    : false
}

export function useDeviceOrientation() {
  return orientation.value === 'landscape-primary' ? 'desktop' : 'mobile'
}

export function hasTouchEvent() {
  return 'ontouchstart' in window
}
