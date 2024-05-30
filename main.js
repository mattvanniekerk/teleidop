/**
 * Send a message to Telegram using the Telegram Bot API
 * @param {string} message the message to be sent
 * @returns {Promise<void>} a promise that resolves when the message is sent
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
 * Format a transaction object into a human-readable message
 * @param {object} transaction the transaction object to be formatted
 * @returns {string} the formatted transaction message
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
 * @param {object} authorization the authorization object for the transaction
 * @returns {Promise<boolean>} a promise that resolves to true if the transaction should proceed, false otherwise.
 */
const beforeTransaction = async (authorization) => {
    console.log(authorization);
    // const message = 'Authorization Request:' + formatTransactionMessage(authorization);
    // await sendMessageToTelegram(message);
    return true;
};

/**
 * This function runs after an approved transaction.
 * @param {object} transaction the approved transaction object.
 * @returns {Promise<void>} a promise that resolves when the necessary actions are completed.
 */
const afterTransaction = async (transaction) => {
    console.log(transaction);
    const message = 'Transaction Approved:' + formatTransactionMessage(transaction);
    await sendMessageToTelegram(message);
};

/**
 * This function runs after a declined transaction.
 * @param {object} transaction the declined transaction object.
 * @returns {Promise<void>} a promise that resolves when the necessary actions are completed.
 */
const afterDecline  = async (transaction) => {
    console.log(transaction);
    const message = 'Transaction Declined:' + formatTransactionMessage(transaction);
    await sendMessageToTelegram(message);
};
