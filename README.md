# gemini-to-html

Parse out gemini pages and convert them to HTML

## Usage

```
npm i --save gemini-to-html
```

```javascript
const parse = require('gemini-to-html/parse')

const tokens = parse(`
# Hello

=> ./example This is a link
`)

const render = require('gemini-to-html/render')

const html = render(tokens)

console.log(html)
```

## API

### `parse(text) => [Line]`

Parse out some gemini text into an array of Line items to render

#### `Text{type:'text', content: string}`

Any lines that don't fit into other formats, will be Text. `content` is the raw text to render.

#### `Link{type:'link', href: string, content: string}`

Lines starting with `=>` will be parsed as links. The line will then contain a URL that will go under `href`, followed by some optional whitespace, and then a description for the text stored in `content`.

#### `Pre{type:'pre', items: [string], alt}`

Sections of text that look like this:

> ```alt
> Some text
> ```

Will be parsed as a sing `Pre` line. The `items` are the lines within the block. If ther was additional text provided in the backticks, it'll be in the `alt` text.

#### `Header{type:'header', level: number, content: string}`

Lines starting with one or more `#` symbols will be interpreted as headers. The number of consequtive `#` symbols will be the `level` of the header. The header text will be within `content`.

#### `List{type:'list', items: [string]}`

Lines starting with `*` will be grouped together. Each line will be an item within `items`.

#### `Quote{type: 'quote', content: 'string'}`

Lines starting with `>` will be interpreted as a quote with the `content` being separated out.

### `render([Block]) => html`

Take the parsed out blocks and render an HTML page.

This module uses [escape-goat](https://www.npmjs.com/package/escape-goat) to avoid HTML and JS injection to combat XSS.

Regular `Text` will be converted to `<p>` tags, however blank lines will be converted to `<br/>` elements as per the spec.

Preformatted text will be turned into `<pre>` tags. If there was an `alt` specified, the text will be wrapped in `<code class="language-${alt}>` so that it can be easily integrated with [highlight.js](https://highlightjs.org/).

List are converted to `<ul>` elements with `<li>` for each item in the list.

Paragraphs are converted to the appropriate `<h1...n>` elements.

Quote items will be wrapped in `<blockquote>` elements.
