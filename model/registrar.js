class Registrar {
  constructor() {
    this.reset()
  }

  reset() {
    this.counter = 0
    this.Types = {}
    this.keys = []
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
    this.keys.push(identifier)
    this.Types[identifier] = Type
  }
}

const registrar = new Registrar()

export {
  registrar,
}
