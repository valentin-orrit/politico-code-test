import * as cheerio from 'cheerio'
import axios from 'axios'

export const scrapeEULegislators = async () => {
  // fetching the legislators data
  const loadLegistlators = async () => {
    try {
      const page = await axios.get(
        'https://www.europarl.europa.eu/meps/en/full-list/all'
      )
      return page
    } catch (error) {
      console.error('error when fetching or loading the page : ', error)
    }
  }

  return []
}
