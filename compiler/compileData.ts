import type { ObjectExpression, ObjectProperty, Statement } from '@babel/types'
import type MagicString from 'magic-string'

export default function compileData(ast: Statement, ms: MagicString) {
	return JSON.stringify(ast, null, 2)
}

export function beforeCompileData() {

}
