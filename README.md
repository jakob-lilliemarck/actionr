A simple lightweight eventbus.

Subscribe action handlers to Actioneer
```js
const { subscribe, dispatch } = useActioneer()

const myActionHandler = {
  action: 'my:action',
  handler: ({ dispatch }) => (...args) => {
    // Will print ["Yay, our first action!"], given that the action is dispatched as shown below.
    console.log(args)
  }
}

const subscribedActionSymbols = subscribe(myActionHandler)

dispatch('my:action', 'Yay, our first action!')

unsubscribe(...subscribedActionSymbols)
```

`subscribe()` return an array of javascript `Symbol` that may be used to
unsubscribe individual handlers from the eventbus, even when many handlers
subscribe to the same action.

Action handlers recieve an object with `dispatch()`, and may dispatch further
actions.
```js
const { subscribe, dispatch } = useActioneer()

const foo = {
  action: 'foo',
  handler: ({ dispatch }) => () => {
    console.log('Running foo')
  }
}

const bar = {
  action: 'bar',
  handler: ({ dispatch }) => () => {
    // this handler dispatches the action "foo"
    dispatch('foo')
  }
}

subscribe(foo, bar)

// Will log "Running foo"
dispatch('foo')
```

`actioneer()` also returns a readonly `Proxy` of it's current `state` including:
- `actions`
- `symbols`
- `handlers`

Assigning to the state or any of it's keys will throw an error, use `subscribe()`
and `unsubscribe()` instead.
```js
const { state } = useActioneer()

// An array of symbols per action
console.log(state.actions)

// A key-value store of { [Symbol]: action }
console.log(state.symbols)

// A key-value store of { [Symbol]: handler }
console.log(state.handlers)
```
