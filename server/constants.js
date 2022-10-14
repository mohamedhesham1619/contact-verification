// This is the data that will be checked
const personNeededData = {
    'first name': 'first name',
    'last name': 'last name',
    'address': 'address',
    'city': 'city',
    'state': 'state',
    'country': 'country',
    'phone': 'phone',
    'fax': 'fax',
}


// The key is the data we need and the value is the (column letter or column number) of this data in the excel sheet
// Every column name in this object must have the right letter that correspond to it in the excel sheet
const excelColumnNames = {
    'first name' : 'B',
    'last name' : 'A',
    'address' : 'E',
    'city' : 'F',
    'state' : 'G',
    'country' : 'H',
    'phone' : 'I',
    'fax' :'J'
}


// NPPES return the abbreviation so we should convert it to the full name before matching
const stateAbbreviations = {
    "AA": "ARMED FORCES AMERICAS",
    "AE": "ARMED FORCES EUROPE",
    "AL": "Alabama",
    "AP": "ARMED FORCES PACIFIC",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "MARIANA ISLANDS, NORTHERN",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}


exports.excelColumnNames = excelColumnNames
exports.personNeededData = personNeededData
exports.stateAbbreviations = stateAbbreviations