const fs = require('fs')

const parse = require('./parse')

const text = fs.readFileSync('./example.gmi', 'utf8')

const parsed = parse(text)

console.log(parsed)

const render = require('./render')

const rendered = render(parsed)

console.log(rendered)
