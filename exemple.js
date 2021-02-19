var xlsx2sql = require('./index.js').xlsx2sql;

xlsx2sql(
    `${__dirname}/test.xlsx`,
    {
        name: 'product',
        skip: 1,
        fields: [
            { index: 0, name: 'title' },
            { index: 1, name: 'start', convert: xlsx2sql.ExcelDateToJSDate },
            {
                index: 2,
                name: 'tva_id',
                convert: function (v) {
                    if (v == '0.1') return 60;
                    if (v == '0.2') return 61;
                    if (v == '0.055') return 59;
                    if (v == '0') return 58;
                    throw new Error(`Unknown tva ${v}`);
                },
            },
            { index: 3, name: 'tarifLibreTtc' },
            {
                index: 4,
                name: 'tarifLibreBoolean',
                convert: function (v) {
                    if (v == 'ON') return 1;
                    return 0;
                },
            },
            { index: 5, name: 'compta' },
            { name: 'createdAt', value: 'now()' },
            { name: 'updatedAt', value: 'now()' },
        ],
    },
    function (err, sql) {
        console.log(err);
        console.log(sql);
    }
);
