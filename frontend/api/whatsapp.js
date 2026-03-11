/**
 * WhatsApp integration utility for Nishat Beverages.
 * Uses wa.me deep links to facilitate manual message sending.
 */

const ADMIN_PHONE_NUMBER = '923001234567'; // Admin's WhatsApp number

/**
 * Opens a pre-filled WhatsApp chat to send a low stock reminder.
 * @param {Object} item - The inventory item that is low on stock.
 */
export const sendLowStockReminder = (item) => {
    const message = `*Low Stock Alert for Nishat Beverages*\n\n` +
                    `Item: *${item.name}*\n` +
                    `Category: ${item.category}\n` +
                    `Current Stock: *${item.stock}*\n\n` +
                    `Please reorder soon to avoid shortages.`;
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodedMessage}`;

    console.log("--- GENERATING WHATSAPP URL ---");
    console.log(`To: ${ADMIN_PHONE_NUMBER}`);
    console.log(`Message: ${message}`);
    console.log("------------------------------------");

    window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Opens a pre-filled WhatsApp chat to send a daily summary reminder to a customer.
 * @param {Object} summary - The calculated daily summary for the customer.
 * @returns {string} The formatted message string.
 */
export const sendCustomerDailySummary = (summary) => {
    const message = `*Nishat Beverages - Daily Summary*\n\n` +
                    `Date: *${new Date(summary.date).toLocaleDateString()}*\n` +
                    `Customer: *${summary.customerName}*\n\n` +
                    `-----------------------------------\n` +
                    `Previous Balance: PKR ${summary.previousBalance.toLocaleString()}\n` +
                    `Today's Bottles Purchased: ${summary.bottlesPurchased} (PKR ${summary.totalSaleAmount.toLocaleString()})\n` +
                    `Today's Paid Amount: PKR ${summary.paidAmount.toLocaleString()}\n` +
                    `Today's Unpaid Amount: PKR ${summary.unpaidAmount.toLocaleString()}\n` +
                    `-----------------------------------\n\n` +
                    `*New Total Balance: PKR ${summary.closingBalance.toLocaleString()}*\n` +
                    `*Remaining Empty Bottles: ${summary.remainingEmpties}*\n\n` +
                    `Thank you, Nishat Beverages.`;

    const encodedMessage = encodeURIComponent(message);
    // Remove non-digits from phone number for URL compatibility
    const url = `https://wa.me/${summary.customerMobile.replace(/\D/g, '')}?text=${encodedMessage}`;

    console.log("--- GENERATING CUSTOMER WHATSAPP URL ---");
    console.log(`To: ${summary.customerMobile}`);
    console.log(`Message:\n${message}`);
    console.log("---------------------------------------------");
    
    window.open(url, '_blank', 'noopener,noreferrer');

    return message;
};

/**
 * Opens a pre-filled WhatsApp chat to send an on-demand account summary to a customer.
 * @returns {string}
 */
export const sendCustomerSummaryReminder = (
    mobile,
    name,
    balance,
    emptiesHeld,
    lastSaleDate
) => {
    const message = `*Nishat Beverages - Account Summary*\n\n` +
                    `Hi ${name},\n\n` +
                    `Here is a summary of your account as of today:\n\n` +
                    `- Outstanding Balance: *PKR ${balance.toLocaleString()}*\n` +
                    `- Empty Bottles Held: *${emptiesHeld}*\n` +
                    `- Last Transaction: ${lastSaleDate}\n\n` +
                    `Thank you for your business!`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${mobile.replace(/\D/g, '')}?text=${encodedMessage}`;

    console.log("--- GENERATING CUSTOMER SUMMARY URL ---");
    console.log(`To: ${mobile}`);
    console.log(`Message:\n${message}`);
    console.log("---------------------------------------------");

    window.open(url, '_blank', 'noopener,noreferrer');

    return message;
};