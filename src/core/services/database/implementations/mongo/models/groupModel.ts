import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A group must have a name!'],
		unique: true,
	},
});

export default mongoose.model('Group', groupSchema);
