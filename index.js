module.exports = function actioneer (dispatchDecorator=(fn) => fn, logging=true) {

  const state = {
    actions: {},
    symbols: {},
    handlers: {}
  }

  const subscribe = (...handlers) => {
    /**
    @param {Array} handlers Any number of handler objects of the format { action: string, handler: (action, ...args) => {} }
    */
    return handlers.map(({ action, handler }) => {
      const symbol = Symbol(action)

      state.handlers[symbol] = handler({ dispatch })
      state.symbols[symbol] = action

      if (state.actions[action]) {
        state.actions[action].push(symbol)
      } else {
        state.actions[action] = [symbol]
      }

      return symbol
    })
  }

  const unsubscribe = (...symbols) => {
    /**
    @param {Array} symbols Any number of symbols to unsubscribe from the action handler.
    */
    symbols.forEach((symbol) => {
      const action = state.symbols[symbol]

      if (action) {
        if (state.actions[action].length > 1) {
          const i = state.actions[action].indexOf(symbol)
          state.actions[action].splice(i, 1)
        } else {
          delete state.actions[action]
        }
        delete state.handlers[symbol]
        delete state.symbols[symbol]
      } else {
        if (logging) {
          console.warn(`Attempted unsubscribe from unknown symbol: "${symbol.toString()}"`)
        }
      }

    })
  }

  const dispatch = dispatchDecorator((action, ...args) => {
    /**
    @param {String} action
    @param {Array} args Any number of arbitary arguments to pass to the handler.
    */
    if (state.actions[action]) {
      return state.actions[action].reduce((a, symbol) =>
        ({ ...a, [symbol]: state.handlers[symbol](...args) }),
        {}
      )
    } else {
      if (logging) {
        throw new Error(`Unhandled action "${action}"`)
      }
    }
  })

  const proxyHandler = {
    set: (target, key, value) => {
      throw new Error(`Direct assign to actioneer state is not permitted, use subscribe and unsubscribe to add or remove actions instead`)
    }
  }

  return {
    state: new Proxy(state, proxyHandler),
    subscribe,
    unsubscribe,
    dispatch
  }
}
