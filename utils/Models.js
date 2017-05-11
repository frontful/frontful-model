import {registrar} from './Registrar'

export class Models {
  constructor() {
    this.createModelInstanceGetterProperties()
  }

  createModelInstanceGetterProperties() {
    const instances = {}

    registrar.items.keys().forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => {
          if (!instances[key]) {
            const Model = registrar.items[key].value
            instances[key] = new Model()
          }
          return instances[key]
        },
        enumerable: true,
        configurable: false,
      })
    })
  }
}
