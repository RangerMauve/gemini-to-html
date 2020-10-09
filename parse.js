const HEADER = /^(#+)\s+(.*)/
const PRE = /^```(.*)?/
const LIST = /^\*\s+(.*)/
const QUOTE = /^>\s+(.*)/
const LINK = /^=>\s+(\S+)\s*(.*)/

module.exports = parse

function parse (text) {
  const lines = text.split(/\r?\n/)

  const tokens = []

  let index = 0

  function current () {
    return lines[index]
  }

  while (index < lines.length) {
    const line = current()
    let match = null
    if (match = line.match(HEADER)) {
      const [_, levels, content] = match

      tokens.push({ type: 'header', level: levels.length, content })
    } else if (match = line.match(PRE)) {
      const [_, alt] = match
      const items = []
      index++

      while (index < lines.length) {
        const item = current()
        if (current().match(PRE)) break
        items.push(item)
        index++
      }

      tokens.push({ type: 'pre', items, alt })
    } else if (match = line.match(LIST)) {
      const items = []

      while (index < lines.length) {
        const match = current().match(LIST)
        if (!match) break
        const [_, item] = match
        items.push(item)
        index++
      }

      // Go back since we went to far
      index--

      tokens.push({ type: 'list', items })
    } else if (match = line.match(QUOTE)) {
      const [_, content] = match

      tokens.push({ type: 'quote', content })
    } else if (match = line.match(LINK)) {
      const [_, href, rawContent] = match
      const content = rawContent || href

      tokens.push({ type: 'link', content, href })
    } else {
      tokens.push({ type: 'text', content: line })
    }

    index++
  }

  return tokens
}
