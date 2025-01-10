const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = '!';
const mercadoPagoAccessToken = 'SEU_ACCESS_TOKEN_AQUI';

client.once('ready', () => {
    console.log('Bot está online!');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'venda') {
        const produto = args.join(' ');
        if (!produto) {
            return message.channel.send('Por favor, especifique o produto que deseja vender.');
        }

        try {
            const paymentData = {
                transaction_amount: 100, // Valor da transação
                description: produto,
                payment_method_id: 'pix', // Método de pagamento
                payer: {
                    email: 'comprador@example.com' // Email do comprador
                }
            };

            const response = await axios.post('https://api.mercadopago.com/v1/payments', paymentData, {
                headers: {
                    'Authorization': `Bearer ${mercadoPagoAccessToken}`
                }
            });

            const paymentUrl = response.data.point_of_interaction.transaction_data.ticket_url;
            message.channel.send(`Pedido recebido para: ${produto}. Pague usando o seguinte link: ${paymentUrl}`);
        } catch (error) {
            console.error(error);
            message.channel.send('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
        }
    }
});

client.login('SEU_TOKEN_AQUI');