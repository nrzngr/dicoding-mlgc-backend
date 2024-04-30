const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/inputError");

async function predictClassification(model, image) {
	try {
		const tensor = tf.node
			.decodeJpeg(image)
			.resizeNearestNeighbor([224, 224])
			.expandDims()
			.toFloat();

		const prediction = model.predict(tensor);
		const score = await prediction.data();
		const confidenceScore = Math.max(...score) * 100;

		const classes = ["Cancer", "Non-cancer"];

		const classResult = tf.argMax(prediction, 1).dataSync()[0];
		const label = classes[classResult];

		let suggestion;

		if (label === "Cancer") {
			suggestion = "Segera periksa ke dokter!";
		}
		if (label === "Non-cancer") {
			suggestion = "awokawokawko";
		}

		return { confidenceScore, label, suggestion };
	} catch (error) {
		throw new InputError(`Terjadi kesalahan input: ${error.message}`);
	}
}

module.exports = predictClassification;
