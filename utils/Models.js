import {registrar} from './registrar'

export class Models {
  constructor(dependencies) {
    this.dependencies = dependencies
    this.models = new Map()
    this.data = {}
    this.context = {
      ...this.dependencies,
      models: this,
    }
  }

  global(...args) {
    let key, Type, data

    if (typeof args[0] === 'string') {
      [key, Type, data] = args
      if (!registrar.Types[key]) {
        registrar.register(key, Type)
      }
    }
    else {
      [Type, data] = args
      key = Type.identifier
    }

    if (!key) {
      console.warn('Missing model identifier')
    }

    if(this.models.has(key)) {
      return this.models.get(key)
    }
    else {
      const model = new Type('deferred')
      this.models.set(key, model)
      model.initializer(this.data[key] || data, this.context)
      delete this.data[key]
      return model
    }
  }

  serialize() {
    return Array.from(this.models.entries()).reduce((result, [key, value]) => {
      result[key] = value.serialize()
      return result
    }, {})
  }

  deserialize(data) {
    Object.keys(data).forEach((key) => {
      if (registrar.Types[key]) {
        const model = new registrar.Types[key]('deferred')
        this.models.set(key, model)
        model.initializer(data[key], this.context)
      }
      else {
        this.data[key] = data[key]
      }
    })
  }
}
