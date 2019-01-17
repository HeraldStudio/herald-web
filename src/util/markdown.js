import marked from 'marked'

marked.setOptions({
  gfm: true,
  renderer: Object.assign(new marked.Renderer(), {
    link: (href, title, text) => href === text && title == null ? href : (
      `<a href="${ href }" title="${ title || '' }">${ text }</a>`
    )
  })
})

export default function renderMarkdown(markdown) {
  return marked(markdown.replace(/\*{4}/g, '** **')).replace(/\*\*/g, '')
}