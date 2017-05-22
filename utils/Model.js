import {formatter} from './formatter'
import deepExtend from 'deep-extend'

function model(format) {
  return model.format(format)
}

model.format = function(format) {
  if (!format.isFormat) {
    format = formatter.schema(format)
  }

  return function (Type) {
    function Model(data) {
      Model.prototype.deserialize.call(this, data)
      Type.call(this, data)
    }

    Model.isModelType = true

    Model.prototype = Object.create(Type.prototype)
    Model.prototype.constructor = Model

    Model.prototype.isModel = true
    Model.prototype.deserialize = function(data) {
      format.deserialize(data, () => this)
    }
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

export {
  model
}
