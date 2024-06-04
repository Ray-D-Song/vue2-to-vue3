'use client'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { useCallback, useMemo, useState } from 'react'
import { parse as babelParse } from '@babel/parser'
import MagicString from 'magic-string'
import { useWindowSize } from 'react-use'
import { sublime } from '@uiw/codemirror-theme-sublime'
import compileProps from '@/compiler/compileProps'
import { MESSAGE } from '@/compiler/constant'

const regex = /props:\s*(.*)/s
const tip = `props: {
  //...
}`

export default function Home() {
	const [inputCode, setInputCode] = useState('')
	const onChange = useCallback((val: string) => {
		setInputCode(val)
	}, [])

	const outputCode = useMemo(() => {
		try {
			if (inputCode === '')
				return ''
			const match = inputCode.match(regex)
			if (match) {
				const newStr = `const props = ${match[1]}`
		    const ast = babelParse(newStr).program.body
				const ms = new MagicString(newStr)
		    return compileProps(ast, ms)
			}
			return MESSAGE.input_err
		}
		catch (e) {
			return String(e)
		}
	}, [inputCode])

	const { width, height } = useWindowSize()

	return (
		<main className="flex min-h-screen items-center justify-center gap-20">
			<CodeMirror
				value={inputCode}
				extensions={[javascript({ jsx: true })]}
				onChange={onChange}
				placeholder={tip}
				autoFocus
				theme={sublime}
				height={`${height - 160}px`}
				width={`${width / 3}px`}
			/>
			<CodeMirror
				value={outputCode}
				extensions={[javascript({ jsx: true, typescript: true })]}
				onChange={onChange}
				readOnly
				theme={sublime}
				height={`${height - 160}px`}
				width={`${width / 3}px`}
			/>
		</main>
	)
}
