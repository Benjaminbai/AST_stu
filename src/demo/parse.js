const recast = require("recast")

const code =
    `
function add(a, b) {
    return a +
    b
}`

const ast = recast.parse(code)

const add = ast.program.body[0]

console.log(111111111, add)

console.log(222222222, add.params[0])

console.log(333333333, add.body.body[0].argument.left)