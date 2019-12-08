import { useState, useEffect } from 'react'

export default function useDebouncedValue (value, ms, cb) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (value !== undefined) {
      const timeout = setTimeout(() => {
        setDebouncedValue(value)
        // cb && cb()
      }, ms)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [ms, value])

  return debouncedValue
}
