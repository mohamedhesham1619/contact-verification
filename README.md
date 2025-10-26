# NPPES Contact Verification Web App

## Overview

This project was built for a [Topcoder challenge](https://www.topcoder.com/challenges/c587c6b7-f378-4dc7-bb4b-29fb12174025) to automate the verification of healthcare provider data in Excel spreadsheets. It verifies address, city, state, country, phone, and fax details by comparing them with data from the [NPPES API](https://npiregistry.cms.hhs.gov/api-page), suggests corrections, and provides a confidence score.

## Features

- Automated verification of address, city, state, country, phone, and fax for each healthcare provider in an Excel file

- Suggestions for corrected data based on NPPES API results

- Real-time progress tracking during the verification process

- Download of the updated Excel file with corrections and confidence scores

## Validation Process

- The app uses first and last names to search the NPPES API.
- Names with special characters may not be found; spaces and hyphens are removed before searching.
- The NPPES API only returns results with matching first and last names, so names are not included in the confidence score.
- Six fields are validated: address, city, state, country, phone, and fax. Each field has its own score.
- The overall confidence score ("surety percent") is the average of the six field scores. This percent represents how confident the app is that the suggested data belongs to the correct person.
- For example, if multiple results are found with the same first and last name, but one matches exactly on all fields, the surety percent will be 100%—indicating a perfect match. If all fields match except the phone number, the surety percent will be lower (e.g., ~83%), and the app will suggest the new phone number.
- The formula for the surety percent is as follows: for state, country, phone, and fax, the score is either 0 or 1; for address and city, the score is calculated as the number of matched words divided by the number of words in the largest string.

    **Example Scoring**

    - **City**: Comparing "SAINT JOSEPH" with "St. Joseph" results in a score of 1/2.
    - **Address**: Comparing "501 DR MICHAEL DEBAKEY DR" with "501 Dr. Michael DeBakey Drive" results in a score of 3/5.

- If no match is found in the NPPES API, suggestions and scores are left blank.
- Real-time progress tracking is provided during the verification process, so users can see how much of the file has been processed.

## Built With

- Node.js
- Express
- Flutter

## Demo




https://github.com/user-attachments/assets/8f86beef-7cb0-4520-860d-7f9784fbb0b0




