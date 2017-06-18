import {Format} from './Format'

function formatter(format) {
  return formatter.schema(format)
}

formatter.private = (format) => {
  return new Format('private', format, null)
}
formatter.schema = (format) => {
  return new Format('schema', format, null)
}
formatter.model = (format, defaultValue) => {
  return new Format('model', format, defaultValue || null)
}
formatter.ref = (format, defaultValue) => {
  return new Format('ref', format, defaultValue || null)
}
formatter.array = (format, defaultValue) => {
  return new Format('array', format, defaultValue || null)
}
formatter.map = (format, defaultValue) => {
  return new Format('map', format, defaultValue || null)
}
formatter.deep = (defaultValue) => {
  return new Format('deep', null, defaultValue || {})
}
formatter.deepArray = (defaultValue) => {
  return new Format('deepArray', null, defaultValue || null)
}
formatter.deepMap = (defaultValue) => {
  return new Format('deepMap', null, defaultValue || null)
}

export {
  formatter
}
