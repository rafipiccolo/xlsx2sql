let xlsx2sql = require('./index.js');
let assert = require('assert');

describe('check Crontab', () => {
    it('should generate sql', (cb) => {
        xlsx2sql.xlsx2sql(
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
            (err, sql) => {
                assert.ifError(err);
                assert.equal(
                    sql,
                    'insert into `product` (`title`,`start`,`tva_id`,`tarifLibreTtc`,`tarifLibreBoolean`,`compta`,`createdAt`,`updatedAt`) values\n' +
                        "('Privatisation complète du château avec hébergement','2019-01-01','60','0','1','74501652',now(),now()),\n" +
                        "('Hébergement en chambre single','2019-01-01','60','0','1','74501652',now(),now()),\n" +
                        "('Petit déjeuner','2019-01-01','60','0','1','74501652',now(),now()) ;"
                );
                cb();
            }
        );
    });
});
