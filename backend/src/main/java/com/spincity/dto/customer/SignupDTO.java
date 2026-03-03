package com.spincity.dto.customer;

public class SignupDTO {

    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String confirmPassword;
    private String dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String emergencyContact;
    private String emergencyName;
    private String idProofType;       // ✅ ADD — "Aadhar", "PAN", "Passport" etc
    private String idProofDocument;   // ✅ ADD — file path after upload

    // ✅ ADD getters/setters
    public String getIdProofType() { return idProofType; }
    public void setIdProofType(String idProofType) { this.idProofType = idProofType; }

    public String getIdProofDocument() { return idProofDocument; }
    public void setIdProofDocument(String idProofDocument) { this.idProofDocument = idProofDocument; }
    public String getFavFood() {
        return favFood;
    }

    public void setFavFood(String favFood) {
        this.favFood = favFood;
    }

    public String getFavSport() {
        return favSport;
    }

    public void setFavSport(String favSport) {
        this.favSport = favSport;
    }

    private String favFood;
    private String favSport;
    private boolean acceptTerms;

    public SignupDTO() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getEmergencyName() { return emergencyName; }
    public void setEmergencyName(String emergencyName) { this.emergencyName = emergencyName; }

    public boolean isAcceptTerms() { return acceptTerms; }
    public void setAcceptTerms(boolean acceptTerms) { this.acceptTerms = acceptTerms; }
}
