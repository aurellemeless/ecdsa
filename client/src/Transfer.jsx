import { useState } from 'react';
import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
/*

privateKey c9143f6017472bdda6f565219bc7ce9f61e054aadb25e6c8caceb8708cbc368b
publicKey 02e68fd0eed90e06796353ba2257dc1972cacd4c2cf49758d052541b1e67814c48

privateKey 99baf99c08b0c3e085a1153239a8fd1092596704740802d29472a52ddc76fc40
publicKey 02d1bf26b663527f5e464887aa6ee78601556b67c08e3f49b0dd30aeaf56307a05

privateKey e619ca89ad9131078590f6cc260a0bcab1a6ec1c3f66c46b7b4d5a354a47d030
publicKey 0329ee59f51a47434755d95401d677335c2110a7fcd0f5b5d06b0b2fb4cdb776cb

*/

function Transfer({ address, setBalance, privateKey }) {
	const [sendAmount, setSendAmount] = useState('');
	const [recipient, setRecipient] = useState('');

	console.log('privateKey ', privateKey);

	const setValue = (setter) => (evt) => setter(evt.target.value);

	async function transfer(evt) {
		evt.preventDefault();
		const message = { amount: parseInt(sendAmount), recipient };
		const hash = toHex(keccak256(Uint8Array.from(message)));
		console.log('++ hash ', hash);
		const signature = await secp.secp256k1.sign(hash, privateKey);
		console.log(signature);
		BigInt.prototype.toJSON = function () {
			return this.toString();
		};
		try {
			const {
				data: { balance },
			} = await server.post(`send`, {
				sender: address,
				amount: parseInt(sendAmount),
				recipient,
				signature: signature,
				hash: hash.toString(),
			});
			setBalance(balance);
		} catch (ex) {
			console.error(ex);
		}
	}

	return (
		<form className='container transfer' onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder='1, 2, 3...'
					value={sendAmount}
					onChange={setValue(setSendAmount)}
				></input>
			</label>

			<label>
				Recipient
				<input
					placeholder='Type an address, for example: 0x2'
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<input type='submit' className='button' value='Transfer' />
		</form>
	);
}

export default Transfer;
