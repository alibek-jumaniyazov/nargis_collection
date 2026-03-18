import axios from 'axios';

export const sendTelegramNotification = async (message: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram token or chat ID is not set. Skipping notification.');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });
    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
};

export const formatOrderMessage = (order: any, items: any[]) => {
  let message = `🆕 <b>New Order Received!</b>\n\n`;
  message += `<b>Order ID:</b> ${order.id}\n`;
  message += `<b>Customer:</b> ${order.fullName}\n`;
  message += `<b>Phone:</b> ${order.phone}\n`;
  message += `<b>City/District:</b> ${order.city}, ${order.district}\n`;
  message += `<b>Total Amount:</b> $${order.total}\n`;
  message += `<b>Payment Method:</b> ${order.paymentMethod}\n`;
  message += `<b>Date:</b> ${new Date(order.createdAt).toLocaleString()}\n\n`;
  
  message += `📦 <b>Items:</b>\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}`;
    if (item.size || item.color) {
      message += ` (${item.size || ''} ${item.color || ''})`;
    }
    message += ` - ${item.quantity}x @ $${item.price}\n`;
  });

  return message;
};
