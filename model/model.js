import {formatter} from './formatter'
import deepExtend from 'deep-extend'
import {registrar} from './registrar'
import {action} from 'mobx'

function model(format, identifier) {
  return model.format(format, identifier)
}

model.define = function(definer) {
  return function(Model) {
    Model.__model_definer__ = definer
    return Model
  }
}

model.format = function(format, identifier) {
  if (!format.isFormat) {
    format = formatter.schema(format)
  }

  return function (Type) {
    function Model(data, context) {
      if (data !== 'deferred') {
        Model.prototype.initializer.call(this, data, context)
      }
    }

    if (identifier) {
      registrar.register(identifier, Model)
    }
    else {
      registrar.register(Model)
    }

    Model.isModelType = true

    Model.prototype = Object.create(Type.prototype)
    Object.setPrototypeOf(Model, Type)
    Model.prototype.constructor = Model

    Model.prototype.initializer = function(data, context) {
      if (context) {
        this.context = context
        if (Model.__model_definer__) {
          Object.assign(this, Model.__model_definer__.call(this, context))
        }
      }
      else {
        console.warn('Missing `context` argument')
      }
      Model.prototype.deserialize.call(this, data)
      Type.call(this, data, this.context)
    }

    Model.prototype.isModel = true
    Model.prototype.deserialize = action(function(data) {
      format.deserialize(data, this.context, () => this)
    })
    Model.prototype.serialize = function() {
      if (Type.isModelType) {
        return deepExtend(Type.prototype.serialize.call(this), format.serialize(this))
      }
      else {
        return format.serialize(this)
      }
    }

    return Model
  }
}

model.reset = function() {
  registrar.reset()
}

export {
  model
}
