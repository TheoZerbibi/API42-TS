import consola, { Consola } from 'consola';
import date, { Date } from 'date.js';

interface ILogtime {
	days		: number;
	hours		: number;
	minutes		: number;
	secondes	: number;
}

export class Student {

	public	logger: Consola	= consola;

	private	login:string;
	private	projects_user:Array<any>	= [];
	private	valided_project				= 0;
	private	valided_exam				= 0;

	constructor(login:string) {
		this.login = login;
	}

	public async getProject(response:any, cursus_ids:number)
	{
		console.log(`Student : ${this.login} [${response.id}]\nCursus : [${cursus_ids}]\n`);
		await response.projects_users.forEach((project:any) => {
			if (project.cursus_ids == cursus_ids) {
				switch(cursus_ids) {
					case 21:
						if (project['validated?']) {
							if (project.project.name.includes("Exam"))
								this.valided_exam++;
							else if (project.project.name.includes("CPP") && project.project.name.includes("08"))
								this.valided_project++;
							else if (!project.project.name.includes("CPP"))
								this.valided_project++;
						}
						this.projects_user.push(project);
					break;
				}
			}
		});
		for (let project of this.projects_user)
			console.log(`${project.project.name} : ${project.final_mark}`);
		console.log(`\nValided Project : ${this.valided_project}\nValided Exam : ${this.valided_exam}`);
	}

	// Method for '/users/xlogin/locations' routes
	public async getLogTime(response:any, startTime:Date, endTime:Date) {
		let	logtime:ILogtime	= {days:0,hours:0,minutes:0,secondes:0};
		let	tmp:any				= 0;

		await response.forEach((locations:any) => {
			let	begin_at = date(locations.begin_at);
			let	end_at = (locations.end_at) ? date(locations.end_at) : date('now');

			if (begin_at >= startTime)
				tmp += end_at.getTime() - begin_at.getTime();
		});

		logtime.days = Math.floor(tmp / 1000 / 60 / 60 / 24);
		tmp -= logtime.days * 1000 * 60 * 60 * 24;

		logtime.hours = Math.floor(tmp / 1000 / 60 / 60);
		tmp -= logtime.hours * 1000 * 60 * 60;

		logtime.minutes = Math.floor(tmp / 1000 / 60);
		tmp -= logtime.minutes * 1000 * 60;

		logtime.secondes = Math.floor(tmp / 1000);
		console.log('\nlogtime = ' + 
		logtime.days + ' day/s ' + 
		logtime.hours + ' hour/s ' + 
		logtime.minutes + ' minute/s ' + 
		logtime.secondes + ' second/s \n');
	}

	// Method for '/users/xlogin/locations_stats' routes
	// This routes doesn't return the current days
	public async getLogTimeNew(response:any, startTime:Date, endTime:Date) {
		let	logtime:ILogtime	= {days:0,hours:0,minutes:0,secondes:0};

		for (const time in response)
		{
			let _date:Date = date(time);
			if (_date >= startTime)
				console.log(time);
		}
	}

}