import type { NextRequest } from 'next/server'
// @ts-expect-error
import { loadESLint } from 'eslint'
import ts from '@typescript-eslint/eslint-plugin'
import * as tsParser from '@typescript-eslint/parser'

export async function POST(request: NextRequest) {
	try {
	  const FlatESLint = await loadESLint({ useFlatConfig: true })
	  const eslint = new FlatESLint({
		  fix: true,
			overrideConfigFile: true,
			overrideConfig: {
				languageOptions: {
					parser: tsParser,
					parserOptions: {
						ecmaFeatures: { modules: true },
						ecmaVersion: 'latest',
					},
				},
				plugins: {
					'@typescript-eslint': ts,
					ts,
				},
			},
	  })
	  const raw = await request.text()
	  const results = await eslint.lintText(raw)
		console.log(results)
		if ('output' in results[0])
	    return new Response(results[0].output)
		else
		  return new Response(results[0].messages)
	}
	catch (e) {
		console.log(e)
		return new Response('Server eslint error.', {
			status: 500,
		})
	}
}
