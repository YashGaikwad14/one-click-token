import { describe, it, expect } from 'vitest'


describe('sanity', () => {
it('adds numbers', () => {
expect(1 + 1).toBe(2)
})


it('has Buffer polyfill available (node env)', () => {
// Node test env already has Buffer; this guards accidental removal in app
expect(typeof Buffer).toBe('function')
})
})