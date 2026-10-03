package com.in.Dao;

public class NoActiveTransactionException extends Exception {
	
    public NoActiveTransactionException(String message) {
        super(message);
    }
}