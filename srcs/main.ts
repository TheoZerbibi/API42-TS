import { MySQL } from './DB/MySQL';
import { API } from './API';
import { Student } from './methods/Student';
import config from './config/config.json';

const	mySQL				= new MySQL();
const	login:string		= 'thzeribi';
const	cursus_ids:number	= 21;
const 	date:Date			= new Date()
date.setHours(0,0,0,0);

const	startTime:Date	= new Date(date.setDate(date.getDate() - (date.getDay() + 6) % 7));
const	endTime:Date	= new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);

mySQL.start(config.SQL.user, config.SQL.password).then(() => {
	const	Api				= new API();
	const	student:Student	= new Student(login);

	Api.start(config.API.client_id, config.API.client_secret).then(() => {
		Api.request(`/users/${login}`).then((response) => {
			student.getProject(response, cursus_ids);
		}).catch(console.log);
		Api.request(`/users/${login}/locations`).then((response:any) => {
			student.getLogTime(response, startTime, endTime)
		}).catch(console.log);
	}).catch(console.log);
}).catch(console.log);
