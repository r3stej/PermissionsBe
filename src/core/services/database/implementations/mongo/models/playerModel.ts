import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A player must have a name!'],
		unique: true,
	},
	group: {
		type: String,
		required: [true, 'A player must have a group!'],
	},
});

export default mongoose.model('Player', playerSchema);
