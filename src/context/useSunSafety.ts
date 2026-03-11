import { useContext } from 'react'
import { SunSafetyContext } from './sunSafetyStore'

export function useSunSafety() {
  const context = useContext(SunSafetyContext)

  if (!context) {
    throw new Error('useSunSafety must be used within a SunSafetyProvider.')
  }

  return context
}
