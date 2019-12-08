import React, { Suspense } from 'react'

export default function IsomorphicSuspense (props) {
  if (typeof window === 'undefined') return null
  return <Suspense fallback={<></>} {...props} />
}
