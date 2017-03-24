const fs = require('fs')
const readline = require('readline')
const path = require('path')
const stylus = require('stylus')

const keywords = ['@import', '@require']

module.exports = {
  parse: (file, meta) => {
    return new Promise((resolve, reject) => {
      const deps = []
      const rl = readline.createInterface({
        input: fs.createReadStream(file, 'utf8')
      })

      rl.on('line', line => {
        if (line.indexOf(keywords[0]) > -1 || line.indexOf(keywords[1]) > -1) {
          let words = line.split(' ')
          let file = words[words.length - 1]
          deps.push(path.parse(file).name)
        }
      })
        .on('error', err => reject(err))
        .on('close', () => resolve(deps))
    })
  },
  compile: {
    string: (str, opts) => {
      return new Promise((resolve, reject) => {
        stylus.render(str, opts, (err, css) => {
          if (err) reject(err)
          resolve(css)
        })
      })
    },
    file: (path, opts) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) reject(err)
          stylus.render(data, opts, (err, css) => {
            if (err) reject(err)
            resolve(css)
          })
        })
      })
    }
  }
}
