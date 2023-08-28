import type { Heading } from 'nextra'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import 'intersection-observer'

const ActiveAnchorContext = createContext('')
const Observer = createContext<IntersectionObserver | null>(null)

export const useActiveAnchor = () => useContext(ActiveAnchorContext)
export const useObserver = () => useContext(Observer)

export function ActiveAnchorProvider({
  children,
  headings
}: {
  children: ReactNode
  headings: Heading[]
}): ReactElement {
  const [activeId, setActiveId] = useState('')
  const observerRef = useRef<IntersectionObserver>()

  useEffect(() => {
    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('id')!)
          }
        }
      },
      { rootMargin: '0px 0px -80%' }
    )
    const observer = observerRef.current

    return () => {
      observer.disconnect()
    }
  }, [headings])

  return (
    <Observer.Provider value={observerRef.current}>
      <ActiveAnchorContext.Provider value={activeId}>
        {children}
      </ActiveAnchorContext.Provider>
    </Observer.Provider>
  )
}
