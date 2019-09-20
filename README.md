# Install

    npm install xlsx2sql

# Description

Transform an xlsx file into a list of sql insert statement.

- [x] Columns in excel file can be ignored

- [x] title line in excel file can be ignored

- [x] You can specify a custom name for the table used in the generated sql

- [x] You can specify a custom name for each field

- [x] You can specify a custom converter if needed for each field

- [x] Date can be converted to mysql format with our converter

- [x] You can add a custom value (useful if the excel doent contain all the necessary fields)

# Exemple

See exemple files for details : 

* [exemple file](exemple.js)
* [exemple excel](test.xlsx)

usage exemple :

    var xlsx2sql = require('xlsx2sql')

    xlsx2sql.xlsx2sql(`${__dirname}/test.xlsx`, {
        // the name if the table
        name: 'product',
        // the number of first lines to skip
        skip: 1,
        // the fields specifications
        fields: [
            // title is the name of the sql field. It will read the 0's column in excel file
            { index: 0, name: 'title' },
            // start is the name of the sql field. It will read the 1's column in excel file, and convert it using the special date converter
            { index: 1, name: 'start', convert: xlsx2sql.ExcelDateToJSDate },
            // you can also provide a custon function for convertions
            { index: 2, name: 'tva_id', convert: (v) => {
                if (v == '0.1') return 60;
                else if (v == '0.2') return 61;
                else if (v == '0.055') return 59;
                else if (v == '0') return 58;
                else throw new Error('Unknown tva '+v);
            }},
            { index: 3, name: 'tarifLibreTtc' },
            { index: 4, name: 'tarifLibreBoolean', convert: (v) => {
                if (v == 'ON') return 1;
                else return 0;
            }},
            { index: 5, name: 'compta' },
            { name: 'createdAt', value: 'now()' },
            { name: 'updatedAt', value: 'now()' },
        ]
    }, (err, sql) => {

        // generated sql is :
        // insert into `product` (`title`,`start`,`tva_id`,`tarifLibreTtc`,`tarifLibreBoolean`,`compta`,`createdAt`,`updatedAt`) values
        // ('Privatisation complète du château avec hébergement','43466','60','0','1','74501652',now(),now()),
        // ('Hébergement en chambre single','43466','60','0','1','74501652',now(),now()),
        // ('Petit déjeuner','43466','60','0','1','74501652',now(),now()) ;

    })
