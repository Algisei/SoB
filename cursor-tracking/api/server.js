let clients = [];

function sendToAllClients(data) {
    clients.forEach(client => client.write(`data: ${JSON.stringify(data)}\n\n`));
}

module.exports = (req, res) => {
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        clients.push(res);

        req.on('close', () => {
            clients = clients.filter(client => client !== res);
        });
    } else if (req.method === 'POST') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            sendToAllClients(JSON.parse(data));
            res.status(200).end();
        });
    } else {
        res.status(405).end();
    }
};
