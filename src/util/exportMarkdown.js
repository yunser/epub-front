
export default function (notes, meta) {
    console.log(meta)
    let author = meta.creator ? ('-' + meta.creator) : ''
    let content = `# 《${meta.bookTitle}${author}》阅读笔记

`
    for (let note of notes) {
        console.log(note)
        content += '> ' + note.selectedText + '\n'
        if (note.note) {
            content += '\n' + note.note + '\n'
        }
        content += '\n\n'
    }
    const saveAs = window.saveAs
    var blob = new Blob([content], {type: 'text/plain;charset=utf-8'})
    console.log(content)
    saveAs(blob, `《${meta.bookTitle}${author}》阅读笔记` + '.md')
}
