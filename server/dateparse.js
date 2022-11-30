var googleDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;

function parseISODate(d) {
    var m = googleDate.exec(d);
    var year   = +m[1];
    var month  = +m[2];
    var day    = +m[3];
    var hour   = +m[4];
    var minute = +m[5];
    var second = +m[6];

    return Date.UTC(year, month - 1, day, hour, minute, second);
}

module.exports = {parseISODate};