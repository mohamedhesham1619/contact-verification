const ExcelJS = require('exceljs');
const { findBestMatch } = require('./api');
const personNeededData = require('./constants').personNeededData
const excelColumnNames = require('./constants').excelColumnNames

const Workbook = new ExcelJS.Workbook();

let currentProgress = 0, rowsNumber = 0;

// Read the excel file, find best match for each row and create the new excel with the added columns
async function processExcileFile(filePath) {
    let workbook
    // Read the excel sheet
    try {
        workbook = await Workbook.xlsx.readFile(filePath)
    } catch (error) {
        console.log(error)
    }
    const worksheet = workbook.getWorksheet(1)
    rowsNumber = worksheet.rowCount - 1 // doesn't count the header row

    // Find the column numbers
    // Important for adding new columns
    const columnsNumber = worksheet.actualColumnCount

    function addColumn(columnName, columnNumber) {

        // Add the column
        let newColumn = worksheet.getColumn(columnNumber)

        // Set column header, key and width
        newColumn.header = columnName
        newColumn.key = columnName
        newColumn.width = 20
        
        // Set column style
        newColumn.style = {
            border: {
                bottom: { style: 'thin', color: { argb: '00000000' } },
                top: { style: 'thin', color: { argb: '00000000' } },
                left: { style: 'thin', color: { argb: '00000000' } },
                right: { style: 'thin', color: { argb: '00000000' } }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
                shrinkToFit: true
            },
        }

        // Set header style
        let header = worksheet.getRow(1).getCell(columnName);
        header.style = {
            border: {
                bottom: { style: 'thin', color: { argb: '00000000' } },
                top: { style: 'thin', color: { argb: '00000000' } },
                left: { style: 'thin', color: { argb: '00000000' } },
                right: { style: 'thin', color: { argb: '00000000' } }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
                shrinkToFit: true
            }, fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '32CD32' },
            }
        }

    }

    // To add new column the number must be bigger than the columns number in the worksheet
    addColumn('Suggested Address', columnsNumber + 1)
    addColumn('Suggested City', columnsNumber + 2)
    addColumn('Suggested State', columnsNumber + 3)
    addColumn('Suggested Country', columnsNumber + 4)
    addColumn('Suggested Phone', columnsNumber + 5)
    addColumn('Suggested Fax', columnsNumber + 6)
    addColumn('Surety Percent', columnsNumber + 7)

    // Iterate over all the rows in the worksheet
    // Starting from 2 to skip the header row
    for (i = 2; i < worksheet.rowCount ; i++) {
        
        currentProgress = i
        // Log current progress
        console.log(`${i} of ${worksheet.actualRowCount}`)
     
        // Access the current row
        let row = worksheet.getRow(i)

        // Extract the needed data from each row in the sheet
        let person = {}

        person[personNeededData['first name']] = row.getCell(excelColumnNames['first name']).value
        person[personNeededData['last name']] = row.getCell(excelColumnNames['last name']).value
        person[personNeededData.address] = row.getCell(excelColumnNames.address).value
        person[personNeededData.city] = row.getCell(excelColumnNames.city).value
        person[personNeededData.state] = row.getCell(excelColumnNames.state).value
        person[personNeededData.country] = row.getCell(excelColumnNames.country).value
        person[personNeededData.phone] = row.getCell(excelColumnNames.phone).value
        person[personNeededData.fax] = row.getCell(excelColumnNames.fax).value

      
        // Find the best match for this person using NPPES API
        let suggestions = await findBestMatch(person)
 
        // Fill the suggestions columns
        row.getCell('Suggested Address').value = suggestions['Suggested Address']
        row.getCell('Suggested City').value = suggestions['Suggested City']
        row.getCell('Suggested State').value = suggestions['Suggested State']
        row.getCell('Suggested Country').value = suggestions['Suggested Country']
        row.getCell('Suggested Phone').value = suggestions['Suggested Phone Number']
        row.getCell('Suggested Fax').value = suggestions['Suggested Fax Number']
        let suretyPercent = suggestions['surety percent']
        row.getCell('Surety Percent').value = (typeof suretyPercent === 'number') ? `${ Math.round(suretyPercent)}%` : ''
    }

    try {
        await workbook.xlsx.writeFile('output.xlsx')
    } catch (error) {
        console.log(error)
    }
}

exports.processExcileFile = processExcileFile
exports.currentProgress = ()=>{
    return {
        'current_progress' : currentProgress,
        'rows_number' : rowsNumber
    }
}
