const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());

const balances = {
	'02e68fd0eed90e06796353ba2257dc1972cacd4c2cf49758d052541b1e67814c48': 100,
	'02d1bf26b663527f5e464887aa6ee78601556b67c08e3f49b0dd30aeaf56307a05': 50,
	'0329ee59f51a47434755d95401d677335c2110a7fcd0f5b5d06b0b2fb4cdb776cb': 75,
};

app.get('/balance/:address', (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post('/send', (req, res) => {
	const {
		sender,
		recipient,
		amount,
		signature: { r, s, recovery },
		hash,
	} = req.body;
	// verify signature
	if (
		secp.secp256k1.verify(
			{
				r: BigInt(r),
				s: BigInt(s),
				recovery,
			},
			hash,
			sender
		)
	) {
		setInitialBalance(sender);
		setInitialBalance(recipient);

		if (balances[sender] < amount) {
			res.status(400).send({ message: 'Not enough funds!' });
		} else {
			balances[sender] -= amount;
			balances[recipient] += amount;
			res.send({ balance: balances[sender] });
		}
	} else {
		res.status(400).send({ message: 'Corrupted data!' });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0;
	}
}
