package com.spincity.dto.request;

import com.spincity.model.customer.IdProofType;
public class UpdateProfileRequest {

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String age;
    private String customerAddress;
    private String emergencyContact;
    private String emergencyName;
    private String idProofType;
    private String idProofDocument;
    private Boolean notificationsEnabled;
    public Boolean getNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(Boolean v) { this.notificationsEnabled = v; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }

    public String getCustomerAddress() { return customerAddress; }
    public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getEmergencyName() { return emergencyName; }
    public void setEmergencyName(String emergencyName) { this.emergencyName = emergencyName; }

    public String getIdProofType() { return idProofType; }
    public void setIdProofType(String idProofType) { this.idProofType = idProofType; }


    public String getIdProofDocument() { return idProofDocument; }
    public void setIdProofDocument(String idProofDocument) { this.idProofDocument = idProofDocument; }
}