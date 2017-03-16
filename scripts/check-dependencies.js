const rfpify = require('rfpify')
const depcheck = rfpify(require('depcheck'))
const { componentDirsP } = require('./constants')
const readPkg = require('read-pkg')

componentDirsP
  .then((componentDirs) => {
    componentDirs
      .forEach((componentDir) => {
        readPkg(componentDir)
          .then((pkg) => {
            if (pkg.devDependencies) {
              console.error('ERROR: component in the following directory has `devDependencies`: ' + componentDir)
              process.exitCode = 1
            }
          })

        depcheck(componentDir, {})
          .then((report) => {
            [Object.keys(report.missing), report.dependencies]
              .forEach(issues => {
                if (issues.length !== 0) {
                  console.error('ERROR: dependency issues is this directory: ' + componentDir)
                  console.error(report)
                  process.exitCode = 1
                }
              })
          })
      })
  })
