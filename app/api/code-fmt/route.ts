// import type { NextRequest } from 'next/server'
// @ts-expect-error
// import { loadESLint } from 'eslint'

// export async function POST(request: NextRequest) {
// 	try {
// 	  const FlatESLint = await loadESLint({ useFlatConfig: true })
// 	  const eslint = new FlatESLint({
// 		  fix: true,
// 			overrideConfigFile: true,
// 			overrideConfig: {
// 				languageOptions: {
// 					ecmaVersion: 'latest',
// 					sourceType: 'module',
// 				},
// 			},
// 	  })
// 	  const raw = await request.text()
// 		console.log(raw)
// 	  const results = await eslint.lintText(raw)
// 		if ('output' in results[0])
// 	    return new Response(results[0].output)
// 		else
// 		  return new Response(results[0].messages[0].message)
// 	}
// 	catch (e) {
// 		return new Response('Server eslint error.', {
// 			status: 500,
// 		})
// 	}
// }
