'use client'
import { useState, useEffect } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints: Record<Breakpoint, number> = {
  xs: 375, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536
}

export function useResponsive() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const is = (bp: Breakpoint) => width >= breakpoints[bp]
  const isMobile  = width > 0 && width < 768
  const isTablet  = width >= 768 && width < 1024
  const isDesktop = width >= 1024
  const isPanel   = width >= 1280   // wide enough for side panels

  return { width, is, isMobile, isTablet, isDesktop, isPanel }
}
