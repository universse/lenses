import { useEffect, useLayoutEffect, useState } from 'react'

let id = 0
let serverHandoffComplete = false

export default function useId(fallback) {
  const initialId = fallback || (serverHandoffComplete ? generateId() : null)
  const [id, setId] = useState(initialId)

  useLayoutEffect(() => {
    if (id === null) {
      setId(generateId())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (serverHandoffComplete === false) {
      serverHandoffComplete = true
    }
  }, [])
  return id
}

export function makeId() {
  return [...arguments].join('--')
}

function generateId() {
  return ++id
}
