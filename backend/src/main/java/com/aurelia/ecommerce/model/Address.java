package com.aurelia.ecommerce.model;

import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;

public class Address implements Serializable {

    private String id;

    @NotBlank(message = "House or flat details are required")
    private String houseFlat;

    @NotBlank(message = "Street address is required")
    private String street;

    private String landmark;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotBlank(message = "Country is required")
    private String country = "India";

    private boolean isDefault = false;

    public Address() {
    }

    public Address(String id, String houseFlat, String street, String landmark, String city, String state, String pincode, String country, boolean isDefault) {
        this.id = id;
        this.houseFlat = houseFlat;
        this.street = street;
        this.landmark = landmark;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.country = country;
        this.isDefault = isDefault;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHouseFlat() {
        return houseFlat;
    }

    public void setHouseFlat(String houseFlat) {
        this.houseFlat = houseFlat;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }
}
