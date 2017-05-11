import {Format, format} from './Format'

export class Model {
  constructor(state) {
    this.initializeFormat(state)
  }

  initializeFormat(state) {
    if (!(this.format instanceof Format)) {
      this.format = format.schema(this.format)
    }

    this.deserialize(state)
  }

  deserialize(state) {
    this.format.deserialize(state, () => this)
  }

  serialize() {
    return this.format.serialize(this)
  }

  get format() {
    const format = this.__proto__.constructor.format
    if (format) {
      return format
    }
    else {
      throw new Error('format() for Model instances is not defined')
    }
  }

  set format(format) {
    this.__proto__.constructor.format = format
  }
}
