class Registrar {
  constructor() {
    this.items = {}
    this.register = this.register.bind(this)
    this.replace = this.replace.bind(this)
  }
  register(name, value) {
    if (!this.items[name]) {
      this.items[name] = {
        value: value
      }
    }
  }
  replace(name, value) {
    this.items[name] = {
      value: value
    }
  }
  reset() {
    this.items = {}
  }
}

const registrar = new Registrar()

export {
  Registrar,
  registrar,
}
