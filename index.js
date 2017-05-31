const fs = require('fs')
const path = require('path')
const stylus = require('stylus')

const keywords = ['@import', '@require']

module.exports = {
  meta: {
    ext: '.styl',
    outExt: '.css',
    outDir: 'css'
  },
  parse: (file, meta) => {
    const deps = []
    fs.readFileSync(file).toString().split('\n').forEach(line => {
      if (line.indexOf(keywords[0]) > -1 || line.indexOf(keywords[1]) > -1) {
        let words = line.split(' ')
        let file = words[words.length - 1]
        let meta = path.parse(file)
        deps.push(`styl_${meta.name.replace(/'/g, '')}`)
      }
    })

    return deps
  },
  compile: {
    string: (str, opts) => { resolve(stylus.render(str, opts)) },
    file: (path, opts) => {
      let css = stylus(fs.readFileSync(path).toString(), opts)
        .set('filename', path)
        .set('paths', [__dirname])
        .render()
      return css
    }
  }
}
