class Registrar {
  constructor() {
    this.reset()
  }

  reset() {
    this.counter = 0
    this.Types = {}
  }

  register(...args) {
    let identifier, Type
    if (typeof args[0] === 'string') {
      [identifier, Type] = args
    }
    else {
      [Type] = args
      this.counter += 1
      identifier = `midx_${this.counter}`
      Type.identifier = identifier
    }
    this.Types[identifier] = Type
  }
}

export const registrar = new Registrar()
