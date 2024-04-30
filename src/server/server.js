const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/inputError");
require("dotenv").config();

(async () => {
	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: "0.0.0.0", // Listen on all interfaces for Cloud Run
		routes: {
			cors: {
				origin: ["*"], // Adjust allowed origins if needed
			},
		},
	});

	server.route(routes);

	const model = await loadModel();
	server.app.model = model;

	server.ext("onPreResponse", function (request, h) {
		const response = request.response;

		if (response instanceof InputError) {
			// Handle InputError specifically
			const newResponse = h.response({
				status: "fail",
				message: `${response.message} Silahkan gunakan foto lain.`,
			});
			newResponse.code(400); // Use 400 for user-related errors
			return newResponse;
		}

		if (response.isBoom) {
			const newResponse = h.response({
				status: "fail",
				message: response.message,
			});
			newResponse.code(response.output.statusCode); // Use original status code for other errors

			// Check for specific Boom errors (optional)
			if (response.output.statusCode === 413) {
				// Payload too large
				newResponse.message =
					"Payload content length greater than maximum allowed: 1000000";
			}

			return newResponse;
		}

		return h.continue;
	});

	await server.start();
	console.log(`Server started at: ${server.info.uri}`);
})();
