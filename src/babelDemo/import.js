const babel = require(`@babel/core`)
const t = require('babel-types')
// const code = `import {Button, Icon} from 'antd'`
const code = `import antd from 'antd'`

function importPlugin(opt) {
    const { libraryDir } = opt
    return {
        visitor: {
            ImportDeclaration(path) {
                const node = path.node
                const specifiers = node.specifiers
                if (!(specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0]))) {
                    const result = specifiers.map((specifier) => {
                        let local = specifier.local,
                            source
                        // 如果 是  import antd from "antd" 就行不通了，改写
                        // const source = t.stringLiteral(`${node.source.value}/${libraryDir}/${specifier.local.name}`)
                        if (t.isImportDefaultSpecifier(specifier)) {
                            source = t.stringLiteral(node.source.value)
                        } else {
                            source = t.stringLiteral(
                                `${node.source.value}/${libraryDir}/${specifier.local.name}`
                            )
                        }
                        return t.importDeclaration([t.importDefaultSpecifier(local)], source)
                    })
                    console.log('ImportDeclaration -> result', result)
                    path.replaceWithMultiple(result)
                }
            }
        }
    }
}

const r = babel.transform(code, {
    plugins: [importPlugin({ libraryDir: 'lib' })]
})

console.log(r.code)