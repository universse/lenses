import { useEffect, useState } from 'react'

let id = 0

function generateId () {
  return id++
}

export function makeId () {
  return [...arguments].join('--')
}

export default function useId () {
  const [id, setId] = useState(null)
  useEffect(() => {
    setId(generateId())
  }, [])
  return id
}
