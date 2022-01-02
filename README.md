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

Action handlers may dispatch actions
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
    // this handler dispatches another action "foo"
    dispatch('foo')
  }
}

subscribe(foo, bar)

dispatch('foo')
```
