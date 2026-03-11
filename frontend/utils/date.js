/**
 * Formats a date into a local ISO-style string (YYYY-MM-DD).
 * @param {string|number|Date} dateInput 
 * @returns {string}
 */
export const getLocalDateString = (dateInput) => {
    const date = typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput;

    if (isNaN(date.getTime())) {
        return '';
    }

    // Returns YYYY-MM-DD format
    return date.toLocaleDateString('en-CA');
};

/**
 * Gets today's date in YYYY-MM-DD format.
 * @returns {string}
 */
export const getTodayLocalDateString = () => getLocalDateString(new Date());