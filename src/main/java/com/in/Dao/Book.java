package com.in.Dao;

import java.io.Serializable;

public class Book implements Searchable,Serializable {
    private String isbn;
    private String title;
    private String author;
    private int totalCopies;
    private int availableCopies;
    private String genre;

    public Book(String isbn, String title, String author, int totalCopies, String genre) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
        this.genre = genre;
    }
    
    public Book(String isbn, String title, String author, int totalCopies, int availableCopies, String genre) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.genre = genre;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public int getTotalCopies() {
        return totalCopies;
    }

    public int getAvailableCopies() {
        return availableCopies;
    }

    public String getGenre() {
        return genre;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public boolean issueCopy() {
        if (availableCopies > 0) {
            availableCopies--;
            return true;
        }
        return false;
    }

    public boolean returnCopy() {
        if (availableCopies < totalCopies) {
            availableCopies++;
            return true;
        }
        return false;
    }

    public boolean isAvailable() {
        return availableCopies > 0;
    }

    @Override
    public boolean matches(String query) {
        String finalquery = query.toLowerCase();
        if (title.toLowerCase().contains(finalquery) || author.toLowerCase().contains(finalquery) || isbn.toLowerCase().contains(finalquery)) {
            return true;
        }
        return false;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Book other = (Book) obj;
        return isbn.equals(other.isbn);
    }

    @Override
    public int hashCode() {
        return isbn.hashCode();
    }

    @Override
    public String toString() {
        return "Title: " + title + ", Author: " + author + ", ISBN: " + isbn
                + ", Available: " + availableCopies + "/" + totalCopies + ", Genre: " + genre;
    }
}