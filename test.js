const useActioneer = require('./index.js')

let state = null

const a = {
  action: 'state:set',
  handler: ({ disatch }) => (value) => {
    state = value
  }
}

const b = {
  action: 'forward',
  handler: ({ dispatch }) => (value) => {
    dispatch('state:set', value)
  }
}

test('Dispatch and handler dispatches', () => {
  const {
    subscribe,
    dispatch
  } = useActioneer()

  subscribe(a, b)

  expect(state).toBe(null)

  dispatch('state:set', 'value')
  expect(state).toBe('value')

  dispatch('forward', 'other')
  expect(state).toBe('other')
})

test('Decorate dispatch', () => {
  let i = 0
  const beforeAll = (fn) => (...args) => {
    i++
    return fn(...args)
  }

  const {
    subscribe,
    dispatch
  } = useActioneer(beforeAll)

  subscribe(a)

  expect(i).toBe(0)

  dispatch('state:set', true)
  expect(i).toBe(1)
})

test('Throw on unhandled action', () => {
  // init actioneer
  const {
    dispatch
  } = useActioneer()

  // test that handlers have expected effects
  expect(() => dispatch('unhandled')).toThrowError()
})

test('Throw on unsubscribed handlers', () => {
  const {
    subscribe,
    unsubscribe,
    dispatch
  } = useActioneer()

  const symbols = subscribe(a)

  dispatch('state:set', true)
  expect(state).toBe(true)

  unsubscribe(...symbols)
  expect(() => dispatch('state:set', false)).toThrowError()
})
