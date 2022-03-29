import consola, { Consola } from 'consola';
const oauth = require('axios-oauth-client');
import axios from 'axios';
import { readFileSync } from 'fs';


interface IAPI {
	'client_id'		: string;
	'client_secret'	: string;
	'access_token'	: string;
	'grant_type'	: string;
	'url'			: string;

	getAccesToken: () => Promise<any>
	request: (route:string) => Promise<any>
}

export class API implements IAPI {
	
	public logger: Consola = consola;

	client_id!		: string;
	client_secret!	: string;
	access_token!	: string;
	grant_type		: string = "client_credentials";
	url				: string = "https://api.intra.42.fr/v2";

	public async start(client_id:string, client_secret:string): Promise<void> {
		this.client_id		= client_id;
		this.client_secret	= client_secret;
		// this.access_token = "dd4e9ae49ea98613fc0052a930ddc61a955516a98a7b89113289875a10bfec7e";
		await this.getAccesToken();

		this.logger.success('API is ready!');
	}


	// Stock AccesHeader in MySQL + Check before get
	async getAccesToken(): Promise<any> {
		const promise = await oauth.client(axios.create(), {
			url: 'https://api.intra.42.fr/oauth/token',
			grant_type: this.grant_type,
			client_id: this.client_id,
			client_secret: this.client_secret,
		})
		await promise().catch((error: any) => {
			console.log(`Status : ${error.response.status} | ${error.response.statusText}`);
			console.log(error.response.data);
			process.exit(1);
		}).then((response: any) => {
			// console.log(response);
			this.access_token = response.access_token;
			return(response)
		});
	}

	async request(route:string): Promise<any> {
		const config = {
			headers: { Authorization: `Bearer ${this.access_token}` }
		};

		return new Promise((resolve, reject) => {
			axios.get(`${this.url}${route}`, config)
			.then((response:any) => {
				resolve(response.data);
			})
			.catch((error:any) => {
				reject(error);
			});
		});
	}
}
