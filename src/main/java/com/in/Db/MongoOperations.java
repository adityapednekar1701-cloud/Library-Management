package com.in.Db;

import org.bson.Document;

import com.in.Dao.Book;
import com.in.Dao.Member;
import com.in.Dao.Transaction;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MongoOperations {

	public static Document transactionToDocument(Transaction t) {
		return new Document("_id", t.getTransactionId()).append("isbn", t.getIsbn()).append("memberId", t.getMemberId())
				.append("issueDate", t.getIssueDate().toString()).append("dueDate", t.getDueDate().toString())
				.append("returnDate", t.getReturnDate() == null ? null : t.getReturnDate().toString())
				.append("fineAmount", t.getFineAmount()).append("status", t.getStatus().name());
	}

	public static Transaction documentToTransaction(Document doc) {
		String returnDateStr = doc.getString("returnDate");
		LocalDate returnDate = returnDateStr == null ? null : LocalDate.parse(returnDateStr);

		return new Transaction(doc.getInteger("_id"), doc.getString("isbn"), doc.getInteger("memberId"),
				LocalDate.parse(doc.getString("issueDate")), LocalDate.parse(doc.getString("dueDate")), returnDate,
				doc.getDouble("fineAmount"), Transaction.Status.valueOf(doc.getString("status")));
	}

	public static Document memberToDocument(Member member) {
		return new Document("_id", member.getId()).append("name", member.getName()).append("email", member.getEmail())
				.append("phoneNumber", member.getPhoneNumber()).append("address", member.getAddress())
				.append("membershipDate", member.getMembershipDate().toString())
				.append("borrowedBooks", member.getBorrowedBooks()).append("fineAmount", member.getFineAmount());
	}

	public static Member documentToMember(Document doc) {
		List<String> rawList = doc.getList("borrowedBooks", String.class);
		ArrayList<String> borrowedBooks = new ArrayList<>(rawList != null ? rawList : new ArrayList<>());

		return new Member(doc.getInteger("_id"), doc.getString("name"), doc.getString("email"),
				doc.getString("phoneNumber"), doc.getString("address"),
				LocalDate.parse(doc.getString("membershipDate")), borrowedBooks, doc.getDouble("fineAmount"));
	}

	public static Document bookToDocument(Book book) {
		return new Document("_id", book.getIsbn()).append("title", book.getTitle()).append("author", book.getAuthor())
				.append("genre", book.getGenre()).append("totalCopies", book.getTotalCopies())
				.append("availableCopies", book.getAvailableCopies());
	}

	public static Book documentToBook(Document doc) {
		return new Book(doc.getString("_id"), doc.getString("title"), doc.getString("author"),
				doc.getInteger("totalCopies"), doc.getInteger("availableCopies"), doc.getString("genre"));
	}

}
