package com.in.Dao;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.in.Db.MongoDBConnection;
import com.in.Db.MongoOperations;
import com.in.Db.SequenceGenerator;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

public class Library {
	private HashMap<String, Book> catalog = new HashMap<>();
	private HashMap<Integer, Member> members = new HashMap<>();
	private ArrayList<Transaction> transactions = new ArrayList<>();

	public void addBook(Book book) {
		catalog.put(book.getIsbn(), book);

		MongoDatabase db = MongoDBConnection.getDatabase();
		db.getCollection("books").insertOne(MongoOperations.bookToDocument(book));
	}

	public void removeBook(String isbn) {
		Book book = catalog.get(isbn);
		if (book != null && book.getAvailableCopies() < book.getTotalCopies()) {
			System.out.println("Cannot remove: some copies are currently issued.");
			return;
		}
		catalog.remove(isbn);

		MongoDatabase db = MongoDBConnection.getDatabase();
		db.getCollection("books").deleteOne(eq("_id", isbn));
	}

	public List<Book> searchBooks(String query) {
		return catalog.values().stream().filter(book -> book.matches(query)).collect(Collectors.toList());
	}

	public Member registerMember(String name, String email, String phoneNumber, String address) {
		int newId = SequenceGenerator.getNextSequence("memberId");
		Member member = new Member(newId, name, email, phoneNumber, address, LocalDate.now());
		members.put(newId, member);

		MongoDatabase db = MongoDBConnection.getDatabase();
		db.getCollection("members").insertOne(MongoOperations.memberToDocument(member));

		return member;
	}

	public List<Book> getAllBooks() {
		return new ArrayList<>(catalog.values());
	}

	public List<Member> getAllMembers() {
		return new ArrayList<>(members.values());
	}

	public boolean bookExists(String isbn) {
		return catalog.containsKey(isbn);
	}

	public Optional<Member> getMember(int id) {
		return Optional.ofNullable(members.get(id));
	}

	public void issueBook(String isbn, int memberId) throws BookNotFoundException, MemberNotFoundException,
			BookNotAvailableException, FineLimitExceededException {

		Book book = catalog.get(isbn);
		if (book == null) {
			throw new BookNotFoundException("No book found with ISBN: " + isbn);
		}

		Member member = members.get(memberId);
		if (member == null) {
			throw new MemberNotFoundException("No member found with ID: " + memberId);
		}

		if (!book.issueCopy()) {
			throw new BookNotAvailableException("No copies available for: " + book.getTitle());
		}

		boolean memberSideSuccess = member.borrowBook(isbn);
		if (!memberSideSuccess) {
			book.returnCopy();
			throw new FineLimitExceededException(
					"Member " + memberId + " cannot borrow: limit reached or fine too high.");
		}

		int newTransactionId = SequenceGenerator.getNextSequence("transactionId");
		Transaction transaction = new Transaction(newTransactionId, isbn, memberId, LocalDate.now());
		transactions.add(transaction);

		MongoDatabase db = MongoDBConnection.getDatabase();
		db.getCollection("books").updateOne(eq("_id", isbn), set("availableCopies", book.getAvailableCopies()));
		db.getCollection("members").updateOne(eq("_id", memberId), set("borrowedBooks", member.getBorrowedBooks()));
		db.getCollection("transactions").insertOne(MongoOperations.transactionToDocument(transaction));
	}

	public void returnBook(String isbn, int memberId)
			throws BookNotFoundException, MemberNotFoundException, NoActiveTransactionException {
		Book book = catalog.get(isbn);
		if (book == null) {
			throw new BookNotFoundException("No book found with ISBN: " + isbn);
		}

		Member member = members.get(memberId);
		if (member == null) {
			throw new MemberNotFoundException("No member found with ID: " + memberId);
		}

		Transaction activeTransaction = transactions.stream().filter(t -> t.getIsbn().equals(isbn)
				&& t.getMemberId() == memberId && t.getStatus() == Transaction.Status.ACTIVE).findFirst().orElse(null);

		if (activeTransaction == null) {
			throw new NoActiveTransactionException("No active transaction found for this book and member.");
		}

		activeTransaction.markReturned(LocalDate.now());
		book.returnCopy();
		member.returnBook(isbn);

		if (activeTransaction.getFineAmount() > 0) {
			member.addFine(activeTransaction.getFineAmount());
		}

		MongoDatabase db = MongoDBConnection.getDatabase();
		db.getCollection("books").updateOne(eq("_id", isbn), set("availableCopies", book.getAvailableCopies()));
		db.getCollection("members").updateOne(eq("_id", memberId), com.mongodb.client.model.Updates
				.combine(set("borrowedBooks", member.getBorrowedBooks()), set("fineAmount", member.getFineAmount())));
		db.getCollection("transactions").updateOne(eq("_id", activeTransaction.getTransactionId()),
				com.mongodb.client.model.Updates.combine(
						set("returnDate", activeTransaction.getReturnDate().toString()),
						set("fineAmount", activeTransaction.getFineAmount()),
						set("status", activeTransaction.getStatus().name())));
	}

	public List<Transaction> getOverdueTransactions() {
		return transactions.stream().filter(t -> t.isOverdue()).collect(Collectors.toList());
	}

	public List<Book> getMostBorrowedBooks() {
		Map<String, Long> borrowCounts = transactions.stream()
				.collect(Collectors.groupingBy(Transaction::getIsbn, Collectors.counting()));

		return borrowCounts.entrySet().stream().sorted(Map.Entry.<String, Long>comparingByValue().reversed())
				.map(entry -> catalog.get(entry.getKey())).filter(book -> book != null).collect(Collectors.toList());
	}

	public void loadAllFromDB() {
		MongoDatabase db = MongoDBConnection.getDatabase();

		MongoCollection<Document> bookDocs = db.getCollection("books");
		for (Document doc : bookDocs.find()) {
			Book book = MongoOperations.documentToBook(doc);
			catalog.put(book.getIsbn(), book);
		}

		MongoCollection<Document> memberDocs = db.getCollection("members");
		int maxMemberId = 0;
		for (Document doc : memberDocs.find()) {
			Member member = MongoOperations.documentToMember(doc);
			members.put(member.getId(), member);
			maxMemberId = Math.max(maxMemberId, member.getId());
		}

		MongoCollection<Document> transactionDocs = db.getCollection("transactions");
		int maxTransactionId = 0;
		for (Document doc : transactionDocs.find()) {
			Transaction transaction = MongoOperations.documentToTransaction(doc);
			transactions.add(transaction);
			maxTransactionId = Math.max(maxTransactionId, transaction.getTransactionId());
		}

		// One-time seed: only sets the counter if it doesn't already exist in Mongo.
		// Safe to call on every startup — has no effect once the counters are real.
		SequenceGenerator.seedIfAbsent("memberId", maxMemberId);
		SequenceGenerator.seedIfAbsent("transactionId", maxTransactionId);
	}
}