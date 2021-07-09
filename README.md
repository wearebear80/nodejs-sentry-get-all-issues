# nodejs-sentry-get-all-issues

## Motivation

Problem with unobvious pagination using sentry API - https://github.com/getsentry/sentry/issues/27147
There is a nodejs api solution

NOTE: its a very specific solution aimed at solving my specific problem :)

## Installation

```
npm i @m.dolgikh/nodejs-sentry-get-all-issues
```

## How it works

In Setnry API cursor-like pagination is being implemented.
This script recursively calls function which sends request to sentry.
Url with next cursor query parameter is being taken from response headers.
Script is collecting results form responses until it gets result array with zero length (data.length === 0)
and passes resultData to callback-function as argument. 

## Usage

```
const { getAllIssues } from 'nodejs-sentry-get-all-issues' 

getAllIssues(
  url, // your sentry url like - https://sentry.mycompany.com/api/0/organizations/sentry/issues/?limit=100&project=6&query=is%3Aunresolved&shortIdLookup=1&statsPeriod=90d
  token // -your sentry Beaber token - https://docs.sentry.io/api/auth/
  callback: (resultData) => { ...your code } // called after script execution, getting resultData as argument
)
```

for example, my case:

```
// I want to now how many JS-TypeErrors i have for last 90d

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

// result:
{
  "TypeError: Object doesn't support this action": 1521,
  'TypeError: NetworkError when attempting to fetch resource.': 2095,
  "TypeError: Cannot read property 'apply' of undefined": 17160,
  'TypeError: undefined is not a function': 4477,
  ...
} 
```
