package com.in.Dao;

import com.in.Db.MongoDBConnection;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class ApplicationContextListener implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		Library library = new Library();
		library.loadAllFromDB();
		sce.getServletContext().setAttribute("library", library);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		MongoDBConnection.close();
	}
}