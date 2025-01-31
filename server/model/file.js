const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
	filePath: {
		type: String,
		required: false
	},
	uploadedOn: {
		type: String,
	},
	fileName: {
		type: String
	},
	docNumber: {
		type: Number
	}
});

const fileModel = mongoose.model("File", fileSchema);

// Use CommonJS export
module.exports = fileModel;
