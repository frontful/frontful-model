import {Format, format} from './utils/Format'
import {Models} from './utils/Models'
import {Model} from './utils/Model'
import {registrar, Registrar} from './utils/Registrar'

function register(name) {
  return function(Model) {
    registrar.register(name, Model)
  }
}

function replace(name) {
  return function(Model) {
    registrar.replace(name, Model)
  }
}

export {
  Format,
  Model,
  Models,
  Registrar,
  format,
  register,
  registrar,
  replace,
}
