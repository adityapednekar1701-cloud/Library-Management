package com.in.Dao;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Transaction implements Serializable {

	private int transactionId;
	private String isbn;
	private int memberId;
	private LocalDate issueDate;
	private LocalDate dueDate;
	private LocalDate returnDate = null;
	private double fineAmount = 0.0;
	private Status status;

	public enum Status {
		ACTIVE, RETURNED, OVERDUE
	};

	public Transaction(int transactionId, String isbn, int memberId, LocalDate issueDate) {
		this.transactionId = transactionId;
		this.isbn = isbn;
		this.memberId = memberId;
		this.issueDate = issueDate;
		this.dueDate = issueDate.plusDays(14);
		this.status = Status.ACTIVE;
	}

	public Transaction(int transactionId, String isbn, int memberId, LocalDate issueDate, LocalDate dueDate,
			LocalDate returnDate, double fineAmount, Status status) {
		this.transactionId = transactionId;
		this.isbn = isbn;
		this.memberId = memberId;
		this.issueDate = issueDate;
		this.dueDate = dueDate;
		this.returnDate = returnDate;
		this.fineAmount = fineAmount;
		this.status = status;
	}

	public int getTransactionId() {
		return transactionId;
	}

	public String getIsbn() {
		return isbn;
	}

	public int getMemberId() {
		return memberId;
	}

	public LocalDate getIssueDate() {
		return issueDate;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public LocalDate getReturnDate() {
		return returnDate;
	}

	public double getFineAmount() {
		return fineAmount;
	}

	public Status getStatus() {
		return status;
	}

	public boolean isOverdue() {
		LocalDate currentDate = LocalDate.now();
		if (currentDate.isAfter(dueDate) && status != Status.RETURNED) {
			return true;
		}
		return false;
	}

	public void markReturned(LocalDate returnDate) {
		this.returnDate = returnDate;
		calculateFine();
		this.status = Status.RETURNED;
	}

	public void calculateFine() {
		long daysCount = ChronoUnit.DAYS.between(this.dueDate, this.returnDate);
		if (returnDate.isAfter(dueDate)) {
			fineAmount = fineAmount + 5 * daysCount;
		}
	}

	@Override
	public String toString() {
		return "Transaction #" + transactionId + " | ISBN: " + isbn + ", Member: " + memberId + ", Issued: " + issueDate
				+ ", Due: " + dueDate + ", Returned: " + (returnDate == null ? "Not yet" : returnDate) + ", Fine: "
				+ fineAmount + ", Status: " + status;
	}
}