import {Models} from './Models'
import {formatter} from './formatter'
import {model} from './model'

const reset = model.reset.bind(model)

export {
  Models,
  formatter,
  model,
  reset,
}
