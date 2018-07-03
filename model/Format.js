import {formatter} from './formatter'
import {observable, intercept, toJS, action} from 'mobx'

class Format {
  constructor(name, format, defaultValue) {
    this.name = name
    this.format = format
    this.defaultValue = defaultValue
  }

  deserializeValue(format, state, context, getSelf) {
    if (!format) {
      return typeof state === 'undefined' ? format : state
    }

    if (state && state.isModel) {
      state = state.serialize()
    }

    if (format instanceof Format) {
      return format.deserialize(state, context, getSelf)
    }
    else if (format && format.isModelType) {
      return formatter.model(format).deserialize(state || format, context, getSelf)
    }
    else if (Array.isArray(format)) {
      return formatter.array(null).deserialize(state || format, context, getSelf)
    }
    else if (typeof format === 'object') {
      return formatter.schema(format).deserialize(state, context, () => getSelf() || {})
    }
    else {
      return formatter.ref(null).deserialize(typeof state === 'undefined' ? format : state, context, getSelf)
    }
  }

  @action
  deserialize(state, context, getSelf) {
    switch(this.name) {
      case 'schema': {
        state = state || this.defaultValue || {}
        const keys = Object.keys(this.format)
        const result = keys.reduce((object, key) => {
          if(object.hasOwnProperty(key) && Object.getOwnPropertyDescriptor(object, key).get) {
            object[key] = state[key]
            // object[key] = this.deserializeValue(this.format[key], state[key] /* || object[key] */, context, () => object[key])
          }
          else {
            let value
            Object.defineProperty(object, key, {
              get: () => {
                return value && value.get()
              },
              set: (newValue) => {
                value.set(this.deserializeValue(this.format[key], newValue /* || object[key] */, context, () => object[key]))
              },
              enumerable: true,
              configurable: false,
            })
            value = observable.box(this.deserializeValue(this.format[key], state[key], context, () => object[key]), {deep: false})
          }
          return object
        }, getSelf())
        return result
      }
      case 'model': {
        state = state || this.defaultValue || state
        const ModelClass = this.format
        return new ModelClass(state, context)
      }
      case 'private':
      case 'ref': {
        state = state || this.defaultValue || state
        return this.deserializeValue(this.format, state, context, getSelf)
      }
      case 'array': {
        state = state || this.defaultValue || []
        const object = observable.array(state.reduce((object, item, index) => {
          object[index] = this.deserializeValue(this.format, item, context, () => object[index])
          return object
        }, []), {deep: false})
        intercept(object, (change) => {
          if (change.type === 'update') {
            change.newValue = this.deserializeValue(this.format, change.newValue, context, () => object[change.index])
          }
          else if (change.type === 'splice') {
            change.added = change.added.map((item, increment) => {
              return this.deserializeValue(this.format, item, context, () => (((change.index + increment) < object.length) ? object[change.index + increment] : null))
            })
          }
          return change
        })
        return object
      }
      case 'map': {
        state = state || this.defaultValue || {}
        const keys = Object.keys(state)
        const object = observable.map(keys.reduce((object, key) => {
          object[key] = this.deserializeValue(this.format, state[key], context, () => object[key])
          return object
        }, {}), {deep: false})
        intercept(object, (change) => {
          if (change.type === 'add' || change.type === 'update') {
            change.newValue = this.deserializeValue(this.format, change.newValue, context, () => object.get(change.name))
          }
          return change
        })
        return object
      }
      case 'deep': {
        state = state || this.defaultValue || null
        return observable(state)
      }
      case 'deepArray': {
        state = state || this.defaultValue || []
        return observable.array(state)
      }
      case 'deepMap': {
        state = state || this.defaultValue || []
        return observable.map(state)
      }
      default: {
        throw new Error(`Unknown format '${this.name}'`)
      }
    }
  }

  serializeValue(format, object) {
    if (!format) {
      return object
    }
    else if (format instanceof Format) {
      return format.serialize(object)
    }
    else if (format.isModelType) {
      return formatter.model(format).serialize(object)
    }
    else if (Array.isArray(format)) {
      return formatter.array(null).serialize(object)
    }
    else if (typeof format === 'object') {
      return formatter.schema(format).serialize(object)
    }
    else {
      return formatter.ref(null).serialize(object)
    }
  }

  serialize(object) {
    if (!object) {
      return object
    }
    switch(this.name) {
      case 'schema': {
        const keys = Object.keys(this.format)
        return keys.reduce((result, key) => {
          if (this.format[key] && this.format[key].name === 'private') {
            return result
          }
          else {
            result[key] = this.serializeValue(this.format[key], object[key])
            return result
          }
        }, {})
      }
      case 'model': {
        return object.serialize()
      }
      case 'ref': {
        return object
      }
      case 'array': {
        return object.map((item) => {
          return this.serializeValue(this.format, item)
        })
      }
      case 'map': {
        const keys = Array.from(object.keys())
        return keys.reduce((result, key) => {
          result[key] = this.serializeValue(this.format, object.get(key))
          return result
        }, {})
      }
      case 'deep':
      case 'deepArray':
      case 'deepMap': {
        return toJS(object)
      }
      default: {
        throw new Error(`Unknown format '${this.name}'`)
      }
    }
  }

  get isFormat() {
    return true
  }
}

export {
  Format,
}
