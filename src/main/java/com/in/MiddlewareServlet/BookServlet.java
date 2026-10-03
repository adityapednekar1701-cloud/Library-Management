package com.in.MiddlewareServlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonReader;

import com.in.Dao.Book;
import com.in.Dao.Library;

@WebServlet("/BookServlet")
public class BookServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public BookServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Library library = (Library) getServletContext().getAttribute("library");
		String query = request.getParameter("q");
		List<Book> books;

		if (query != null && !query.isEmpty()) {
			books = library.searchBooks(query);
		} else {
			books = library.getAllBooks();
		}

		JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
		for (Book book : books) {
			JsonObjectBuilder bookBuilder = Json.createObjectBuilder();
			bookBuilder.add("isbn", book.getIsbn());
			bookBuilder.add("title", book.getTitle());
			bookBuilder.add("author", book.getAuthor());
			bookBuilder.add("genre", book.getGenre());
			bookBuilder.add("availableCopies", book.getAvailableCopies());
			bookBuilder.add("totalCopies", book.getTotalCopies());
			arrayBuilder.add(bookBuilder.build());
		}

		JsonObject finalJsonResponse = Json.createObjectBuilder().add("results", arrayBuilder.build()).build();

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.getWriter().write(finalJsonResponse.toString());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Library library = (Library) getServletContext().getAttribute("library");
		JsonReader jsonReader = Json.createReader(request.getReader());
		JsonObject jsonBody = jsonReader.readObject();

		String isbn = jsonBody.containsKey("isbn") ? jsonBody.getString("isbn") : null;
		String title = jsonBody.containsKey("title") ? jsonBody.getString("title") : null;
		String genre = jsonBody.containsKey("genre") ? jsonBody.getString("genre") : null;
		String author = jsonBody.containsKey("author") ? jsonBody.getString("author") : null;
		int totalCopies = jsonBody.containsKey("totalCopies") ? jsonBody.getInt("totalCopies") : 0;
		String message;
		boolean isAdded = false;

		if (isbn == null || title == null || genre == null || author == null || totalCopies <= 0) {
			message = "Missing or invalid fields.";
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		} else if (library.bookExists(isbn)) {
			message = "Book with this ISBN already exists.";
			response.setStatus(HttpServletResponse.SC_CONFLICT);
		} else {
			Book book = new Book(isbn, title, author, totalCopies, genre);
			library.addBook(book);
			isAdded = true;
			message = "Book added successfully!";
			response.setStatus(HttpServletResponse.SC_CREATED);
		}

		JsonObject finalJsonResponse = Json.createObjectBuilder().add("success", isAdded).add("message", message)
				.build();

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.getWriter().write(finalJsonResponse.toString());
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
