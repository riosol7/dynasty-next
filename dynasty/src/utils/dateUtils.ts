export const toDateTime = (secs: number) => {
    var t = Number(secs);
    if (isNaN(t)) {
        // Handle the case where `secs` is not a valid number
        return "Invalid Date";
    };

    let dateObj = new Date(t);
    var month   = dateObj.toLocaleString('default', { month: 'long' });
    var day     = dateObj.getUTCDate();
    var year    = dateObj.getUTCFullYear();
    
    return month + " " + day + ", " + year;
};

export const formatDate = (inputDate: string): string => {
    const dateParts = inputDate.split('-');
    
    if (dateParts.length !== 3) {
        throw new Error('Invalid date format. Please provide a date in the format YYYY-MM-DD.');
    };

    const [year, month, day] = dateParts;
    return `${month}-${day}-${year}`;
};