package com.in.Db;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.inc;

import org.bson.Document;

import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.ReturnDocument;

public class SequenceGenerator {

	private static final String COUNTERS_COLLECTION = "counters";

	public static int getNextSequence(String sequenceName) {
		MongoCollection<Document> counters = MongoDBConnection.getDatabase().getCollection(COUNTERS_COLLECTION);

		Document updatedCounter = counters.findOneAndUpdate(eq("_id", sequenceName), inc("seq", 1),
				new FindOneAndUpdateOptions().upsert(true).returnDocument(ReturnDocument.AFTER));

		return updatedCounter.getInteger("seq");
	}

	public static void seedIfAbsent(String sequenceName, int minValue) {
		MongoCollection<Document> counters = MongoDBConnection.getDatabase().getCollection(COUNTERS_COLLECTION);
		Document existing = counters.find(eq("_id", sequenceName)).first();
		if (existing == null) {
			counters.insertOne(new Document("_id", sequenceName).append("seq", minValue));
		}
	}
}