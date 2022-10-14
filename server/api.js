const axios = require('axios');
const { personNeededData } = require('./constants');
const comparePersons = require('./compare_persons').comparePersons



// Extract the needed data from NPPES API response
function filterApiResponse(data) {
    let filteredData = {}

    filteredData[personNeededData.address] = data['address_1'] // address
    filteredData[personNeededData.city] = data['city'] // city
    filteredData[personNeededData.state] = data['state'] // state
    filteredData[personNeededData.country] = data['country_name'] // country
    filteredData[personNeededData.phone] = data['telephone_number'] // phone
    filteredData[personNeededData.fax] = data['fax_number'] // fax

    return filteredData
}

// Find best match for person from the excel sheet
async function findBestMatch(person) {

    // If the name has space or '-' we must remove it in order to find it in the NPPES API
    let firstName = person[personNeededData['first name']].replaceAll(' ', '').replaceAll('-', '')
    let lastName = person[personNeededData['last name']].replaceAll(' ', '').replaceAll('-', '')

    let url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&enumeration_type=NPI-1&first_name=${firstName}&last_name=${lastName}&use_first_name_alias=false`
    let possibeMatch = {}
    let bestMatch = {}
    let biggestPercent = 0
    try {
        // Send API request
        let res = await axios.get(url)

        // Save the results
        let results = res.data['results']

        // Check if there is response
        if (typeof results !== 'undefined') {

            //Check if there if at least one result
            if (results.length > 0) {

                // Iterate over every person in the result
                results.forEach(result => {

                    // Iterate over every address for the current person
                    result['addresses'].forEach(address => {

                        // Extract the needed data
                        possibeMatch = filterApiResponse(address)

                        // Compare the person from the excel sheet with the current matched one from the NPPES API
                        let suggestions = comparePersons(person, possibeMatch)

                        // If the current matched one have bigger surety percent than the current biggest percent
                        // save the percent and save him as the best match 
                        if (suggestions['surety percent'] >= biggestPercent) {
                            biggestPercent = suggestions['surety percent']
                            bestMatch = JSON.parse(JSON.stringify(suggestions))
                        }
                    })
                })
            }
        }
        return bestMatch
        
    } catch (error) {
        //console.log(error.response.data)
        return bestMatch
        
    }
}



exports.findBestMatch = findBestMatch