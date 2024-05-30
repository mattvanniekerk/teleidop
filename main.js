/**
 * Sends a message to Telegram using the Telegram Bot API.
 * @param {string} message - The message to be sent.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
 */
const sendMessageToTelegram = async (message) => {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
    };

    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
};

/**
 * Retrieves the time zone for a given city.
 * @param {string} city - The name of the city.
 * @returns {string} - The time zone for the city.
 */
const getTimeZone = (city) => {
    const cityToTimeZoneMap = {
        "Cape Town": "Africa/Johannesburg",
        // Add other city-to-timezone mappings as needed
    };
    return cityToTimeZoneMap[city] || 'UTC'; // Default to UTC if city is not found
};

/**
 * Formats a transaction object into a human-readable message.
 * @param {object} transaction - The transaction object to be formatted.
 * @returns {string} - The formatted transaction message.
 */
const formatTransactionMessage = (transaction) => {
    return `
- Account Number: ${transaction.accountNumber}
- Date & Time: ${transaction.dateTime}
- Amount: ${(transaction.centsAmount / 100).toFixed(2)} ${transaction.currencyCode.toUpperCase()}
- Type: ${transaction.type}
- Reference: ${transaction.reference}
- Card ID: ${transaction.card.id}
- Merchant:
  - Name: ${transaction.merchant.name}
  - Category: ${transaction.merchant.category.name} (Code: ${transaction.merchant.category.code})
  - Location: ${transaction.merchant.city}, ${transaction.merchant.country.name} (${transaction.merchant.country.code})
`;
};

/**
 * This function runs during the card transaction authorization flow.
 * It has a limited execution time, so keep any code short-running.
 * @param {object} authorization - The authorization object for the transaction.
 * @returns {Promise<boolean>} - A promise that resolves to true if the transaction should proceed, false otherwise.
 */
const beforeTransaction = async (authorization) => {
    console.log(authorization);
    // const message = 'Authorization Request:' + formatTransactionMessage(authorization);
    // await sendMessageToTelegram(message);
    return true;
};

/**
 * This function runs after an approved transaction.
 * @param {object} transaction - The approved transaction object.
 * @returns {Promise<void>} - A promise that resolves when the necessary actions are completed.
 */
const afterTransaction = async (transaction) => {
    console.log(transaction);
    const message = 'Transaction Approved:' + formatTransactionMessage(transaction);
    await sendMessageToTelegram(message);
};

/**
 * This function runs after a declined transaction.
 * @param {object} transaction - The declined transaction object.
 * @returns {Promise<void>} - A promise that resolves when the necessary actions are completed.
 */
const afterDecline  = async (transaction) => {
    console.log(transaction);
    const message = 'Transaction Declined:' + formatTransactionMessage(transaction);
    await sendMessageToTelegram(message);
};
