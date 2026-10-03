package com.in.MiddlewareServlet;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonReader;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import com.in.Dao.*;

@WebServlet("/TransactionServlet/*")
public class TransactionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public TransactionServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Library library = (Library) getServletContext().getAttribute("library");
		String path = request.getPathInfo(); // e.g. "/overdue", "/most-borrowed"

		if (path == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			writeResponse(response, errorJson("Unknown endpoint."));
			return;
		}

		JsonObject finalJsonResponse;

		if (path.equals("/overdue")) {
			List<Transaction> overdue = library.getOverdueTransactions();
			JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
			for (Transaction t : overdue) {
				arrayBuilder.add(buildTransactionJson(t));
			}
			finalJsonResponse = Json.createObjectBuilder().add("results", arrayBuilder.build()).build();

		} else if (path.equals("/most-borrowed")) {
			List<Book> books = library.getMostBorrowedBooks();
			JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
			for (Book book : books) {
				arrayBuilder.add(Json.createObjectBuilder().add("isbn", book.getIsbn()).add("title", book.getTitle())
						.add("author", book.getAuthor()).add("genre", book.getGenre())
						.add("availableCopies", book.getAvailableCopies()).add("totalCopies", book.getTotalCopies()));
			}
			finalJsonResponse = Json.createObjectBuilder().add("results", arrayBuilder.build()).build();

		} else {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			finalJsonResponse = errorJson("Unknown endpoint: " + path);
		}

		writeResponse(response, finalJsonResponse);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Library library = (Library) getServletContext().getAttribute("library");
		String path = request.getPathInfo();

		if (path == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			writeResponse(response, errorJson("Unknown endpoint."));
			return;
		}

		JsonReader jsonReader = Json.createReader(request.getReader());
		JsonObject jsonBody = jsonReader.readObject();

		String isbn = jsonBody.containsKey("isbn") ? jsonBody.getString("isbn") : null;
		Integer memberId = jsonBody.containsKey("memberId") ? jsonBody.getInt("memberId") : null;

		if (isbn == null || memberId == null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			writeResponse(response, errorJson("Missing isbn or memberId."));
			return;
		}

		JsonObject finalJsonResponse;

		if (path.equals("/issue")) {
			try {
				library.issueBook(isbn, memberId);
				response.setStatus(HttpServletResponse.SC_CREATED);
				finalJsonResponse = Json.createObjectBuilder().add("success", true)
						.add("message", "Book issued successfully!").build();
			} catch (BookNotFoundException | MemberNotFoundException e) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				finalJsonResponse = errorJson(e.getMessage());
			} catch (BookNotAvailableException | FineLimitExceededException e) {
				response.setStatus(HttpServletResponse.SC_CONFLICT);
				finalJsonResponse = errorJson(e.getMessage());
			}

		} else if (path.equals("/return")) {
			try {
				library.returnBook(isbn, memberId);
				response.setStatus(HttpServletResponse.SC_OK);
				finalJsonResponse = Json.createObjectBuilder().add("success", true)
						.add("message", "Book returned successfully!").build();
			} catch (BookNotFoundException | MemberNotFoundException e) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				finalJsonResponse = errorJson(e.getMessage());
			} catch (NoActiveTransactionException e) {
				response.setStatus(HttpServletResponse.SC_CONFLICT);
				finalJsonResponse = errorJson(e.getMessage());
			}

		} else {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			finalJsonResponse = errorJson("Unknown endpoint: " + path);
		}

		writeResponse(response, finalJsonResponse);
	}

	private JsonObjectBuilder buildTransactionJson(Transaction t) {
		return Json.createObjectBuilder().add("transactionId", t.getTransactionId()).add("isbn", t.getIsbn())
				.add("memberId", t.getMemberId()).add("issueDate", t.getIssueDate().toString())
				.add("dueDate", t.getDueDate().toString())
				.add("returnDate", t.getReturnDate() == null ? "Not yet" : t.getReturnDate().toString())
				.add("fineAmount", t.getFineAmount()).add("status", t.getStatus().toString());
	}

	private JsonObject errorJson(String message) {
		return Json.createObjectBuilder().add("success", false).add("message", message).build();
	}

	private void writeResponse(HttpServletResponse response, JsonObject json) throws IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.getWriter().write(json.toString());
	}

	@Override
	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setStatus(HttpServletResponse.SC_OK);
	}
}