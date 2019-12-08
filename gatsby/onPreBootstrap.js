const { existsSync, readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const reactDocgen = require('react-docgen')
const { createDisplayNameHandler } = require('react-docgen-displayname-handler')
const System = require('@phuocsss/system')

module.exports = ({ store }) => {
  const { directory } = store.getState().program

  Object.keys(System).forEach(componentName => {
    const file = join(directory, '../', 'system', 'src', `${componentName}.js`)
    const component = readFileSync(file).toString()

    // const examplePath = file.replace('.js', '.example.js')
    // try to grab ${component}.example.js
    // if (existsSync(examplePath)) {
    //   data.example = readFileSync(examplePath).toString()
    // }

    try {
      const docGen = reactDocgen.parse(
        component,
        reactDocgen.resolver.findExportedComponentDefinition,
        reactDocgen.defaultHandlers.concat(
          createDisplayNameHandler(componentName)
        )
      )

      docGen.componentName = componentName

      const infoJson = join(directory, 'src', 'docs', `${componentName}.json`)

      writeFileSync(
        infoJson,
        JSON.stringify({ data: JSON.stringify(docGen), componentName }, null, 2)
      )
    } catch (e) {
      console.log(e)
    }
  })
}
