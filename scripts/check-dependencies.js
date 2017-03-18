const rfpify = require('rfpify')
const depcheck = rfpify(require('depcheck'))
const { componentDirsP } = require('./constants')

componentDirsP
  .then((componentDirs) => {
    componentDirs
      .forEach((componentDir) => {
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
