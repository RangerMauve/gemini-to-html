const { htmlEscape } = require('escape-goat')
const slug = require('slug')

module.exports = render

function id(content) {
  return slug(content, {
    replacement: '_'
  })
}

function render (tokens) {
  return tokens.map((line) => {
    const { type } = line

    switch (type) {
      case 'quote': return htmlEscape`<blockquote>${line.content}</blockquote>`
      case 'header': return htmlEscape`<h${line.level} id="${id(line.content)}">${line.content}</h${line.level}>`
      case 'link': return htmlEscape`<p><a href="${line.href}">${line.content}</a></p>`
      case 'pre': return line.alt
        ? htmlEscape`<pre><code class="language-${line.alt}">\n${line.items.join('\n')}\n</code></pre>`
        : htmlEscape`<pre>\n${line.items.join('\n')}\n</pre>`
      case 'list': return `<ul>\n${line.items.map((item) => htmlEscape`\t<li>${item}</li>`).join('\n')}\n</ul>`
      default: return line.content ? htmlEscape`<p>${line.content}</p>` : '<br/>'
    }
  }).join('\n')
}
