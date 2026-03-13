/**
 * Regex patterns to identify bottle sizes in item names.
 */
const NINETEEN_LTR_REGEX = /19\s*(ltr|liter|litre)/i;
const SIX_LTR_REGEX = /6\s*(l|ltr|liter|litre)/i;

/**
 * Checks if a name matches 19L bottle patterns.
 */
export const is19LItemName = (name) => !!name && NINETEEN_LTR_REGEX.test(name);

/**
 * Checks if a name matches 6L bottle patterns.
 */
export const is6LItemName = (name) => !!name && SIX_LTR_REGEX.test(name);

/**
 * Infers the payment category ('19Ltr Collection' or '6Ltr Collection') 
 * based on the inventory item linked to a sale.
 * * @param {Array} inventory - The list of inventory items.
 * @param {number|null} inventoryItemId - The ID of the item sold.
 * @param {number} amountReceived - The cash/bank received.
 * @param {string} [existingCategory] - A category if already set.
 * @returns {string|undefined}
 */
export const inferPaymentCategoryFromInventory = (
    inventory,
    inventoryItemId,
    amountReceived,
    existingCategory
) => {
    // If category exists or data is missing, return what we have
    if (existingCategory || !inventoryItemId || !amountReceived || amountReceived <= 0) {
        return existingCategory;
    }

    const matchedItem = inventory.find(item => item.id === inventoryItemId);
    if (!matchedItem) {
        return existingCategory;
    }

    if (is19LItemName(matchedItem.name)) {
        return '19Ltr Collection';
    }

    if (is6LItemName(matchedItem.name)) {
        return '6Ltr Collection';
    }

    return existingCategory;
};