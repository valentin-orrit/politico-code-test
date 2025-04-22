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

          return { name, lastName, partyGroup, country, url }
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

// Helper function to format LegislatorsName to working URL
const formatLegislatorsName = (name) => {
  return name
    .toUpperCase()
    .replace(/\s+/g, '_') // replaces spaces with underscores
    .normalize('NFD') // Decomposes accented letters to letter + accent
    .replace(/[\u0300-\u036f]/g, '') // Removes accents
    .replace(/[^A-Z_]/g, '') // Replace other non latin letters + punctuation
}
