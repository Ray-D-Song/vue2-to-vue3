'use client'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { parse as babelParse } from '@babel/parser'
import MagicString from 'magic-string'
import { useWindowSize } from 'react-use'
import { sublime } from '@uiw/codemirror-theme-sublime'
import { PROPERTIES, PROPERTY_MAP } from '@/compiler/constant'
import type { PropertyMapKey, PropertyMapVal } from '@/compiler/constant'

export default function Home() {
	const { width, height } = useWindowSize()

	const [inputCode, setInputCode] = useState('')
	const onChange = useCallback((val: string) => {
		setInputCode(val)
	}, [])

	const [currentProperty, setCurrentProperty] = useState<PropertyMapKey>('props')
	const pm = useMemo(() => {
		setInputCode('')
		return PROPERTY_MAP.get(currentProperty) as PropertyMapVal
	}, [currentProperty])

	const [outputCode, setOutputCode] = useState('')

	useEffect(() => {
		const fetchFormattedCode = async () => {
			try {
				if (inputCode === '') {
					setOutputCode('')
					return
				}

				const newStr = pm.beforeCompile ? pm.beforeCompile(inputCode) : inputCode
				const ast = babelParse(newStr).program.body[0]
				const ms = new MagicString(newStr)
				const raw = pm.compiler(ast, ms)

				const response = await fetch('/api/code-fmt', {
					method: 'POST',
					body: raw,
				})

				const fmtCode = await response.text()
				setOutputCode(fmtCode)
			}
			catch (e: any) {
				setOutputCode(e.stack)
			}
		}

		fetchFormattedCode()
	}, [inputCode, pm])

	return (
		<main className="flex min-h-screen items-center justify-center gap-20">
			<section>
				{PROPERTIES.map((item, idx) => (
					<div
						key={idx}
						onClick={() => setCurrentProperty(item)}
						className="hover:cursor-pointer my-4 h-8 bg-slate-700 text-gray-300 p-2 rounded-md text-lg flex justify-center items-center"
					>
						{item}
					</div>
				))}
			</section>
			<CodeMirror
				value={inputCode}
				extensions={[javascript({ jsx: true })]}
				onChange={onChange}
				placeholder={pm.tip}
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
