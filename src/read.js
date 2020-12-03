#!/usr/bin/env node
const recast = require("recast")
const TNT = recast.types.namedTypes

recast.run(function (ast, printSource) {
    // printSource(ast)

    // recast.visit(ast, {
    //     visitExpressionStatement: function ({ node }) {
    //         console.log(node)
    //         return false
    //     }
    // })

    recast.visit(ast, {
        visitExpressionStatement: function (path) {
            const node = path.node
            printSource(node)

            // if(TNT.ExpressionStatement.check(node)) {
            //     console.log('this is a ExpressionStatement')
            // }

            TNT.ExpressionStatement.assert(node)
            this.traverse(path)
        }
    })
})