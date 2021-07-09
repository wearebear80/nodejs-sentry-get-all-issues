const { getAllIssues } = require('./index' )

const callback = resultData => {
  const resultMap = {}
  resultData
    .filter(record => record.title.includes('TypeError'))
    .forEach(record => {
      resultMap[record.title] = resultMap[record.title] ? Number(resultMap[record.title]) + Number(record.count) : Number(record.count)
    })
  console.log(resultMap)
} 

getAllIssues(
  'https://sentry.{my_company}.com/api/0/organizations/{my_organization}/issues/?limit=100&project=6&query=is%3Aunresolved&shortIdLookup=1&statsPeriod=90d',
  'my_token',
  callback
)