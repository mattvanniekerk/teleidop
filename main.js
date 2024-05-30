const sendMessageToTelegram = async (message) => {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
    };

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
};

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

const getTimeZone = (city) => {
    const cityToTimeZoneMap = {
        "Cape Town": "Africa/Johannesburg",
        // Add other city-to-timezone mappings as needed
    };
    return cityToTimeZoneMap[city] || 'UTC'; // Default to UTC if city is not found
};

// This function runs during the card transaction authorization flow.
// It has a limited execution time, so keep any code short-running.
const beforeTransaction = async (authorization) => {
    console.log(authorization);
    // const message = `Authorization Request: ${JSON.stringify(authorization)}`;
    // await sendMessageToTelegram(message);
    return true;
};

// This function runs after an approved transaction.
const afterTransaction = async (transaction) => {
    console.log(transaction)
    // const message = `Transaction Approved: ${JSON.stringify(transaction)}`;
    // await sendMessageToTelegram(message);
    const message = 'Transaction Approved:' + formatTransactionMessage(transaction);
    await sendMessageToTelegram(message);
};

// This function runs after a declined transaction
const afterDecline  = async (transaction) => {
    console.log(transaction);
    // const message = `Transaction Declined: ${JSON.stringify(transaction)}`;
    // await sendMessageToTelegram(message);
    const message = 'Transaction Declined:' + formatTransactionMessage(transaction);
    await sendMessageToTelegram(message);
};
