var xlsx = require('node-xlsx').default;
var fs = require('fs');
var moment = require('moment');

function xlsx2sql(file, config, callback) {
    if (!config.name) throw new Error('Bad config, please specify a table "name"');
    config.fields.forEach(function (field) {
        if ((typeof field.value === 'undefined' && typeof field.index === 'undefined') || !field.name)
            throw new Error('Bad config, please specify a "name" and ("index" or "value") for each ligne');
    });

    // open and parse xls
    fs.readFile(file, function (err, s) {
        if (err) return callback(err);

        const excel = xlsx.parse(s);
        var page = excel[0].data;
        // skip X first lines
        for (var i = 0; i < config.skip; i++) page.shift();

        // foreach line in page we go through the array and replace to sql
        var fields = config.fields.map((x) => x.name);
        var values = [];
        page.forEach(function (line) {
            var x = [];
            config.fields.forEach(function (field) {
                if (typeof field.value !== 'undefined') x.push(field.value);
                else if (typeof field.index !== 'undefined') {
                    if (field.convert) x.push(escaping(field.convert(line[field.index])));
                    else x.push(escaping(line[field.index]));
                }
            });
            values.push(x);
        });
        var sql = `insert into \`${config.name}\` (${fields.map((x) => '`' + x + '`').join(',')}) values\n${values
            .map((x) => '(' + x + ')')
            .join(',\n')} ;`;
        callback(null, sql);
    });
}

function ExcelDateToJSDate(date) {
    return moment(new Date(Math.round((date - 25569) * 86400 * 1000))).format('YYYY-MM-DD');
}

function escaping(s) {
    s = '' + s;
    s = s.replace(/'/g, "''");
    s = "'" + s + "'";
    return s;
}

module.exports = {
    xlsx2sql,
    ExcelDateToJSDate,
    escaping,
};
