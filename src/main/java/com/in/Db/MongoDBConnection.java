package com.in.Db;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

public class MongoDBConnection {
    private static final String CONNECTION_STRING = "mongodb://localhost:27017";
    private static final String DATABASE_NAME = "library_db";

    private static MongoClient mongoClient;
    private static MongoDatabase mongoDb;

    public static synchronized MongoDatabase getDatabase() {
        if (mongoDb == null) {
            mongoClient = MongoClients.create(CONNECTION_STRING);
            mongoDb = mongoClient.getDatabase(DATABASE_NAME);
        }
        return mongoDb;
    }

    public static void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}