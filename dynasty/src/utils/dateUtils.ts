export const toDateTime = (secs: number) => {
    var t = Number(secs);
    if (isNaN(t)) {
        // Handle the case where `secs` is not a valid number
        return "Invalid Date";
    }

    let dateObj = new Date(t);
    var month = dateObj.toLocaleString('default', { month: 'long' });
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    return month + " " + day + ", " + year;
}