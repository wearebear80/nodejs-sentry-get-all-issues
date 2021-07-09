const fetch = require('node-fetch')

function getAllIssues(_url, _token, _callback) {
  const resultData = []

  function resloveData(__url, __token) {

    console.log()

    if (!__url) {
      throw new Error(`[nodejs-sentry-get-all-issues] getting data error:  url for next request not found`)
    }

    let nextPageUrl = ''
    console.info('[nodejs-sentry-get-all-issues] info:', `sending request... url: ${__url}`)
    fetch(__url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${__token}`
        }
    })
      .then(response => {
        const linkRaw = response.headers.get('Link')
        const nextPageUrlRaw = String(linkRaw.split(',')[1].split(' ')[1])
        nextPageUrl = nextPageUrlRaw.substring(1, nextPageUrlRaw.length - 2)
        return response.json()
      })
      .then(data => {
        resultData.push(...data)
        console.info('[nodejs-sentry-get-all-issues] info:', `data received, url: ${__url}`)
        if(data.length === 0) {
          return _callback(resultData)
        } 
        resloveData(nextPageUrl, __token)
      })
      .catch(err => console.error('[nodejs-sentry-get-all-issues] error:', err))
  }

  resloveData(_url, _token)
}

module.exports = { getAllIssues }
