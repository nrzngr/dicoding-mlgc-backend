const predictClassification = require("../services/inference");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
	const { image } = request.payload;
	const { model } = request.server.app;

	try {
		const { confidenceScore, label, suggestion } = await predictClassification(
			model,
			image
		);

		const id = crypto.randomUUID();
		const createdAt = new Date().toISOString();

		const data = {
			id: id,
			result: label,
			suggestion: suggestion,
			createdAt: createdAt,
		};

		await storeData(id, data);

		const response = h.response({
			status: "success",
			message:
				confidenceScore > 99
					? "Model is predicted successfully."
					: "Model is predicted successfully but under threshold. Please use the correct picture",
			data,
		});
		response.code(201);
		return response;
	} catch (error) {
		console.error("Error during prediction:", error);
		// Handle other prediction errors here (if applicable)

		const newResponse = h.response({
			status: "fail",
			message: "Terjadi kesalahan dalam melakukan prediksi",
		});
		newResponse.code(400); // Use 400 for general prediction errors
		return newResponse;
	}
}

module.exports = postPredictHandler;
