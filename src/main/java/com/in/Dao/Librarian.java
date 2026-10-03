package com.in.Dao;

import java.io.Serializable;

public class Librarian extends Person implements Serializable {
    private String employeeCode;
    private String designation;

    public Librarian(int id, String name, String email, String phoneNumber, String address,
                      String employeeCode, String designation) {
        super(id, name, email, phoneNumber, address);
        this.employeeCode = employeeCode;
        this.designation = designation;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    @Override
    public void displayDetails() {
        System.out.println("Librarian Name: " + getName() + ", ID: " + getId()
                + ", Employee Code: " + employeeCode + ", Designation: " + designation);
    }
}