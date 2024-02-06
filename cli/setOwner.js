import "dotenv/config";
import mongoose from 'mongoose';
import { getUserByUsername } from '../src/models/user.js';

await mongoose.connect(process.env.DB_URL);

const users = process.argv.slice(2);

for(const username of users) {
	const user = await getUserByUsername(username);

	if(user) {
		user.isOwner = !user.isOwner;
		await user.save();

		console.log(`set isOwner=${user.isOwner}`);
	} else {
		console.warn(`user @${username} doesn't exist`);
	}
}

mongoose.disconnect();
