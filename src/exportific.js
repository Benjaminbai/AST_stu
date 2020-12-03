#!/usr/bin/env node
const recast = require("recast")

const {
    identifier: id,
    expressionStatement,
    memberExpression,
    assignmentExpression,
    arrowFunctionExpression,
    blockStatement
} = recast.types.builders

recast.run(function (ast, printSource) {
    // console.log('\n\nstep1:')
    // printSource(blockStatement([]))

    // console.log('\n\nstep2:')
    // printSource(arrowFunctionExpression([], blockStatement([])))


    // console.log('\n\nstep3:')
    // printSource(assignmentExpression('=', id('add'), arrowFunctionExpression([], blockStatement([]))))

    // console.log('\n\nstep4:')
    // printSource(expressionStatement(assignmentExpression('=', memberExpression(id('exports'), id('add')),
    //     arrowFunctionExpression([], blockStatement([])))))

    let funcIds = []
    recast.types.visit(ast, {
        visitFunctionDeclaration(path) {
            const node = path.node
            const funcName = node.id
            const params = node.params
            const body = node.body

            funcIds.push(funcName.name)

            const rep = expressionStatement(assignmentExpression('=', memberExpression(id('exports'), funcName), arrowFunctionExpression(params, body)))
            path.replace(rep)
            return false
        }
    })

    recast.types.visit(ast, {
        visitCallExpression(path) {
            const node = path.node
            if (funcIds.includes(node.callee.name)) {
                node.callee = memberExpression(id('exports'), node.callee)
            }
            return false
        }
    })

    printSource(ast)
}) 