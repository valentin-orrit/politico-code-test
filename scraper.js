import * as cheerio from 'cheerio'
import axios from 'axios'

export const scrapeEULegislators = async () => {
  // Fetching the legislators data
  const loadLegislators = async () => {
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
      const html = await loadLegislators()
      const $ = cheerio.load(html)

      const legislatorsData = $('.erpl_member-list-item')
        .map((_, el) => {
          const name = $(el).find('.erpl_title-h4').text()
          const lastName = name.split(' ').slice(-1)[0]
          const additionalInfos = $(el).find('.sln-additional-info')
          const partyGroup = $(additionalInfos[0]).text()
          const country = $(additionalInfos[1]).text()

          // reconstructing Full URL with formatted name
          const parsedUrl = $(el)
            .find('.erpl_member-list-item-content')
            .attr('href')
          const formattedName = formatLegislatorsName(name)
          const url = `${parsedUrl}/${formattedName}/home`

          const image = $(el).find('img[loading="lazy"]').attr('src')

          return { name, lastName, partyGroup, country, url, image }
        })
        .get()

      return legislatorsData
    } catch (error) {
      console.error('error when parsing the data : ', error)
    }
  }

  try {
    return await parseLegislatorsData()
  } catch (error) {
    console.error('Error when scraping EU legislators : ', error)
  }
}

// Helper function to format LegislatorsName to working URL
const formatLegislatorsName = (name) => {
  return name
    .toUpperCase()
    .replace(/\s+/g, '_') // replaces spaces with underscores
    .normalize('NFD') // Decomposes accented letters to letter + accent
    .replace(/[\u0300-\u036f]/g, '') // Removes accents
    .replace(/[^A-Z_]/g, '') // Replaces other non latin letters + punctuation
}
