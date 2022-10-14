const { personNeededData } = require('./constants')
const stateAbbreviations = require('./constants').stateAbbreviations

let suggestions = {}

// "person" is the one from the excel sheet, "possibleMatch" is the one from the NPPES API response
function compareAddresses(personAddress, possibleMatchAddress) {
    if(typeof personAddress === 'undefined' || typeof possibleMatchAddress === 'undefined'){
        return 0
    }

    suggestions['Suggested Address'] = possibleMatchAddress

    // Split the addresses to words
    // '820 Lester Avenue' becomes ['820', 'Lester', 'Avenue']
    let personAddressSplitted = personAddress.toLowerCase().split(' ')
    let possibleMatchAddressSplitted = possibleMatchAddress.toLowerCase().split(' ')

    // Find the smaller address string and check the matched words with the larger address string
    let isPersonAddressSmaller = (personAddressSplitted.length < possibleMatchAddressSplitted.length) ? true : false
    let matchedWords = []

    // After finding the number of matched words between the addresses return (number of matched words) / (number of words in the larger address string)
    // This number will determine the similarity percent between the addresses
    // Similarity percent between '3990 HOLLYWOOD RD' and '3960 HOLLYWOOD RD' is 2/3
    if (isPersonAddressSmaller) {
        matchedWords = personAddressSplitted.filter(word => possibleMatchAddressSplitted.includes(word))
        return matchedWords.length / possibleMatchAddressSplitted.length
    } else {
        matchedWords = possibleMatchAddressSplitted.filter(word => personAddressSplitted.includes(word))
        return matchedWords.length / personAddressSplitted.length
    }
}


// "person" is the one from the excel sheet, "possibleMatch" is the one from the NPPES API response
// This function will compare phone numbers and fax numbers as the same logic can be used for both of them
// IF isFaxNumber is true it will add the number as 'fax number' to the suggestions
// IF isFaxNumber is false it will add the number as 'phone number' to the suggestions
function comparePhone(personPhone, possibleMatchPhone, isFaxNumber) {
    if (typeof possibleMatchPhone === 'undefined' || typeof personPhone === 'undefined') {
        return 0
    }

    isFaxNumber ?
        suggestions['Suggested Fax Number'] = possibleMatchPhone
        : suggestions['Suggested Phone Number'] = possibleMatchPhone;

    // Remove all non numbers so '+20 123-456-789' becomes '20123456789'
    let filteredPersonPhone = personPhone.replace(/\D/g, '');
    let filteredPossibleMatchPhone = possibleMatchPhone.replace(/\D/g, '');

    // Find the smaller number
    let isPersonPhoneSmaller = (filteredPersonPhone.length < filteredPossibleMatchPhone) ? true : false

    // If the smaller number is 10 digit and the other one is 12 digit compare the smaller one with 10 digit from the other one starting from the rigth
    // So comparing '12345' with '00054321' will match '12345' with '54321'
    if (isPersonPhoneSmaller) {
        let start = filteredPossibleMatchPhone - filteredPersonPhone
        if (filteredPersonPhone === filteredPossibleMatchPhone.slice(start)) {
            return 1
        }

        return 0
    }
    else {
        let start = filteredPersonPhone - filteredPossibleMatchPhone
        if (filteredPossibleMatchPhone === filteredPersonPhone.slice(start)) {
            return 1
        }
        return 0
    }
}


// "person" is the one from the excel sheet, "possibleMatch" is the one from the NPPES API response
function compareCity(personCity, possibleMatchCity) {
    if(typeof personCity === 'undefined' || typeof possibleMatchCity === 'undefined'){
        return 0
    }

    suggestions['Suggested City'] = possibleMatchCity

    // Split the city to words
    // So 'St. Joseph' becomes ['St.', Joseph]
    let personCitySplitted = personCity.toLowerCase().split(' ')
    let possibleMatchCitySplitted = possibleMatchCity.toLowerCase().split(' ')

    // Find the smaller city string and match its words to the other city string
    let isPersonCitySmaller = (personCitySplitted.length < possibleMatchCitySplitted.length) ? true : false
    let matchedWords = []

    // Return (the number of matched words) / (the number of words of the bigger city string), this will be the similarity percent between the citties
    // So the similarity percent between 'St. Joseph' and 'SAINT JOSEPH' will be 1/2
    if (isPersonCitySmaller) {
        matchedWords = personCitySplitted.filter(word => possibleMatchCitySplitted.includes(word))
        return matchedWords.length / possibleMatchCitySplitted.length
    } else {
        matchedWords = possibleMatchCitySplitted.filter(word => personCitySplitted.includes(word))
        return matchedWords.length / personCitySplitted.length
    }
}

// "person" is the one from the excel sheet, "possibleMatch" is the one from the NPPES API response
function compareState(personState, possibleMatchState) {
    if (typeof possibleMatchState === 'undefined' || typeof personState === 'undefined') {
        return 0
    }

    // Check if the state match the one returned by the API and if it is abbreviation convert it to the full name
    if (possibleMatchState in stateAbbreviations) {
        suggestions['Suggested State'] = stateAbbreviations[possibleMatchState]
        if (personState.toLowerCase() === stateAbbreviations[possibleMatchState].toLowerCase()) {
            return 1
        } else {
            return 0
        }
    } else {
        suggestions['suggested state'] = possibleMatchState
        if (personState.toLowerCase() === possibleMatchState.toLowerCase()) {
            return 1
        } else {
            return 0
        }
    }

    

}

// "person" is the one from the excel sheet, "possibleMatch" is the one from the NPPES API response
function compareCountry(personCountry, possibleMatchCountry) {
    if(typeof personCountry === 'undefined' || typeof possibleMatchCountry === 'undefined'){
        return 0
    }

    suggestions['Suggested Country'] = possibleMatchCountry

    if (personCountry.toLowerCase() == possibleMatchCountry.toLowerCase()) {
        return 1
    }
    return 0
}


// return suggestions and surety percent of these suggestions
// There is 6 pieces of information will be checked and each one will have a surety percent betweeon 0-1
// The final surety percent which will be returned with the suggestions is (sum of all surety percent of each information) / 6
// "person" is the one from the excel sheet, "possibleMatch" is the one from the NPPES API response
function comparePersons(person, possibleMatch) {
    let percent = 0
    percent += compareAddresses(person[personNeededData.address], possibleMatch[personNeededData.address])
    percent += compareCity(person[personNeededData.city], possibleMatch[personNeededData.city])
    percent += compareState(person[personNeededData.state], possibleMatch[personNeededData.state])
    percent += compareCountry(person[personNeededData.country], possibleMatch[personNeededData.country])
    percent += comparePhone(person[personNeededData.phone], possibleMatch[personNeededData.phone], false) // This will compare phone numbers
    percent += comparePhone(person[personNeededData.fax], possibleMatch[personNeededData.fax], true)  // This will compare fax numbers

    suggestions['surety percent'] = (percent / 6) * 100
    return suggestions
}


exports.comparePersons = comparePersons