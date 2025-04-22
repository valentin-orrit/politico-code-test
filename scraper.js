import * as cheerio from 'cheerio'
import axios from 'axios'

export const scrapeEULegislators = async () => {
  // Fetching the legislators data
  const loadLegistlators = async () => {
    try {
      const page = await axios.get(
        'https://www.europarl.europa.eu/meps/en/full-list/all'
      )
      return page.data
    } catch (error) {
      console.error('error when fetching or loading the page : ', error)
    }
  }

  // Parsing the legislators data
  const parseLegislatorsData = async () => {
    try {
      const html = await loadLegistlators()
      const $ = cheerio.load(html)

      const legislatorsData = $('.erpl_member-list-item')
        .map((i, el) => {
          const name = $(el).find('.erpl_title-h4').text()

          return { name }
        })
        .get()

      return legislatorsData
    } catch (error) {
      console.error('error when parsing the data : ', error)
    }
  }

  return await parseLegislatorsData()
}

scrapeEULegislators()
