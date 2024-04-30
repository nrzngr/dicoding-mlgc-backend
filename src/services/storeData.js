const Firestore = require("@google-cloud/firestore");

const db = new Firestore({
	projectId: "submissionmlgc-ridzki",
	keyFilename: `./src/services/serviceAccountKey.json`,
});

async function storeData(id, data) {
	const predictCollection = db.collection("predictions");
	return predictCollection.doc(id).set(data);
}

module.exports = storeData;
