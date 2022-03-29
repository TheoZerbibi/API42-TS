import consola, { Consola } from 'consola';

export class MySQL {

	public logger: Consola = consola;

	public async start(user:string, password:string): Promise<void> {

		this.logger.success('MySQL is ready!');
	}
}