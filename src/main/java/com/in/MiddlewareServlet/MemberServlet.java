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
import java.util.Optional;

import com.in.Dao.Library;
import com.in.Dao.Member;

@WebServlet("/MemberServlet")
public class MemberServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public MemberServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Library library = (Library) getServletContext().getAttribute("library");
		String id = request.getParameter("id");

		JsonObject finalJsonResponse;

		if (id != null && !id.isEmpty()) {
			int properId;
			try {
				properId = Integer.parseInt(id);
			} catch (NumberFormatException e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				finalJsonResponse = Json.createObjectBuilder().add("message", "Invalid id format.").build();
				writeResponse(response, finalJsonResponse);
				return;
			}

			Optional<Member> memberOpt = library.getMember(properId);
			if (memberOpt.isPresent()) {
				Member member = memberOpt.get();
				JsonObjectBuilder memberBuilder = buildMemberJson(member);
				finalJsonResponse = memberBuilder.build();
				response.setStatus(HttpServletResponse.SC_OK);
			} else {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				finalJsonResponse = Json.createObjectBuilder().add("message", "Member not found.").build();
			}
		} else {
			List<Member> allMembers = library.getAllMembers();
			JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
			for (Member member : allMembers) {
				arrayBuilder.add(buildMemberJson(member));
			}
			finalJsonResponse = Json.createObjectBuilder().add("results", arrayBuilder.build()).build();
		}

		writeResponse(response, finalJsonResponse);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Library library = (Library) getServletContext().getAttribute("library");
		JsonReader jsonReader = Json.createReader(request.getReader());
		JsonObject jsonBody = jsonReader.readObject();

		String name = jsonBody.containsKey("name") ? jsonBody.getString("name") : null;
		String email = jsonBody.containsKey("email") ? jsonBody.getString("email") : null;
		String phoneNumber = jsonBody.containsKey("phoneNumber") ? jsonBody.getString("phoneNumber") : null;
		String address = jsonBody.containsKey("address") ? jsonBody.getString("address") : null;

		String message;
		JsonObjectBuilder responseBuilder = Json.createObjectBuilder();

		if (name == null || email == null || phoneNumber == null || address == null) {
			message = "Missing or invalid fields.";
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			responseBuilder.add("success", false).add("message", message);
		} else {
			Member newMember = library.registerMember(name, email, phoneNumber, address);
			message = "Member registered successfully!";
			response.setStatus(HttpServletResponse.SC_CREATED);
			responseBuilder.add("success", true).add("message", message).add("member", buildMemberJson(newMember));
		}

		writeResponse(response, responseBuilder.build());
	}

	private JsonObjectBuilder buildMemberJson(Member member) {
		return Json.createObjectBuilder().add("id", member.getId()).add("name", member.getName())
				.add("email", member.getEmail()).add("address", member.getAddress())
				.add("phoneNumber", member.getPhoneNumber()).add("fineAmount", member.getFineAmount());
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