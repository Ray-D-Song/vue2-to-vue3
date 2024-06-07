import compileData from './compileData'
import compileProps, { beforeCompileProps } from './compileProps'

const MESSAGE = {
	input_err: '格式错误, 请按照提示格式输入',
}

const PROPERTIES = ['props', 'data']
export type PropertyMapKey = typeof PROPERTIES[number]
export type BeforeCompile = (str: string) => string
export interface PropertyMapVal {
	tip: string
	beforeCompile?: BeforeCompile
	compiler: Function
}
const PROPERTY_MAP = new Map<PropertyMapKey, PropertyMapVal>([
	['props', {
		tip: `props: {
  //...
}`,
		beforeCompile: beforeCompileProps,
		compiler: compileProps,
	}],
	['data', {
		tip: `data() {
  return {
    //...
  }
}`,
		compiler: compileData,
	}],
])

export {
	MESSAGE,
	PROPERTIES,
	PROPERTY_MAP,
}
