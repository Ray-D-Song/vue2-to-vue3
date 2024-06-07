import type { ObjectExpression, ObjectProperty, Statement } from '@babel/types'
import type MagicString from 'magic-string'
import { MESSAGE } from './constant'

interface PropMeta {
	name: string
	type: string
	defaultValue: string
	required: boolean
}

export default function compileProps(ast: Statement, ms: MagicString) {
	if (ast.type !== 'VariableDeclaration')
		return MESSAGE.input_err
	const init = ast.declarations[0].init
	if (init?.type !== 'ObjectExpression')
		return MESSAGE.input_err

	const propMetaList: PropMeta[] = []
	init.properties.forEach((item) => {
		if (item.type !== 'ObjectProperty')
			return MESSAGE.input_err
		propMetaList.push(
			processPropItem(item as ObjProperty, ms),
		)
	})

	const typeDeclStr = propMetaList.map(propMeta => `  ${propMeta.name}${propMeta.required ? '' : '?'}: ${propMeta.type}`).join('\n')
	const defaultValueStr = propMetaList.map((propMeta) => {
		let defaultValue = propMeta.defaultValue
		if (propMeta.type === 'string') {
			if (defaultValue && defaultValue.length === 0)
				defaultValue = `''`
			else
				defaultValue = `'${propMeta.defaultValue}'`
		}
		return propMeta.defaultValue !== undefined ? `  ${propMeta.name}: ${defaultValue},\n` : ''
	}).join('')
	return `interface Props {
${typeDeclStr}
}
const props = withDefault(defineProps<Props>(), {
${defaultValueStr}})
`
}

type ObjProperty = ObjectProperty & {
	key: {
		name: string
	}
	value: {
		name: string
	}
}
function processPropItem(item: ObjProperty, ms: MagicString) {
	let type: string = 'unknown'
	let defaultValue: any
	let required = false
	let validator: string | undefined
	if (item.value.type === 'Identifier') {
		type = constructer2Type(item.value.name)
	}
	if (item.value.type === 'ObjectExpression') {
		processObjectExprItem(item.value.properties as ObjProperty[])
	}

	function processObjectExprItem(properties: ObjProperty[]) {
		properties.forEach((iitem) => {
			if (iitem.key.name === 'type') {
				type = constructer2Type(iitem.value.name)
			}
			if (iitem.key.name === 'default') {
				const raw = ms.slice(iitem.value.start as number, iitem.value.end as number)
				// eslint-disable-next-line no-eval
				defaultValue = eval(`(${raw})()`)
			}
			if (iitem.key.name === 'required') {
				// @ts-expect-error
				required = iitem.value.value
			}
			if (iitem.key.name === 'validator') {
				validator = ms.slice(iitem.value.start as number, iitem.value.end as number)
			}
		})
	}

	return {
		name: item.key.name,
		type,
		defaultValue,
		required,
		validator,
	}
}

function constructer2Type(name: string) {
	switch (name) {
		case 'String':
			return 'string'
		case 'Number':
			return 'number'
		case 'Boolean':
			return 'boolean'
		case 'Object':
			return 'object'
		case 'Date':
			return 'Date'
		case 'Function':
			return 'Function'
		case 'Array':
			return 'Array<any>'
		// case 'RegExp':
		// 	return 'RegExp'
		// case 'Error':
		// 	return 'Error'
		case 'Symbol':
			return 'symbol'
		default:
			return 'unknown'
	}
}

export function beforeCompileProps(str: string): string {
	const reg = /props:\s*(.*)/s
	const match = str.match(reg)
	if (match)
		return `const props = ${match[1]}`
	else return ''
}
