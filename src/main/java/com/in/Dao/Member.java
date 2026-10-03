package com.in.Dao;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;

public class Member extends Person implements Serializable {
	private ArrayList<String> borrowedBooks = new ArrayList<>();
	private double fineAmount = 0.0;
	private LocalDate membershipDate;
	private static final int MAX_BOOKS_ALLOWED = 3;

	public Member(int id, String name, String email, String phoneNumber, String address, LocalDate membershipDate) {
		super(id, name, email, phoneNumber, address);
		this.membershipDate = membershipDate;
	}

	public Member(int id, String name, String email, String phoneNumber, String address, LocalDate membershipDate,
			ArrayList<String> borrowedBooks, double fineAmount) {
		super(id, name, email, phoneNumber, address);
		this.membershipDate = membershipDate;
		this.borrowedBooks = borrowedBooks;
		this.fineAmount = fineAmount;
	}

	public ArrayList<String> getBorrowedBooks() {
		return borrowedBooks;
	}

	public double getFineAmount() {
		return fineAmount;
	}

	public LocalDate getMembershipDate() {
		return membershipDate;
	}

	public int getMaxBooksAllowed() {
		return MAX_BOOKS_ALLOWED;
	}

	public boolean borrowBook(String isbn) {
		if (canBorrow()) {
			borrowedBooks.add(isbn);
			return true;
		}
		return false;
	}

	public boolean canBorrow() {
		if (borrowedBooks.size() < MAX_BOOKS_ALLOWED && fineAmount < 1000) {
			return true;
		}
		return false;
	}

	public boolean returnBook(String isbn) {
		if (borrowedBooks.contains(isbn)) {
			borrowedBooks.remove(isbn);
			return true;
		}
		return false;
	}

	public void addFine(double amount) {
		fineAmount = fineAmount + amount;
	}

	public boolean payFine(double amount) {
		if (fineAmount > 0 && amount <= fineAmount) {
			fineAmount = fineAmount - amount;
			return true;
		} else if (amount > fineAmount) {
			fineAmount = 0;
			return true;
		}
		return false;
	}

	@Override
	public void displayDetails() {
		System.out.println("Name is " + getName() + " Id is " + getId() + " BorrowedBooks are " + getBorrowedBooks()
				+ " Fine Amount is " + getFineAmount());
	}
}