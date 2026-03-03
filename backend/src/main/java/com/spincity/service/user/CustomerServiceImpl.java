package com.spincity.service.user;

import com.spincity.dto.request.UpdateProfileRequest;
import com.spincity.model.customer.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.spincity.repository.customer.CustomerRepository;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Properties;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;


@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;


    private final String host = "smtp.gmail.com";
    private final String port = "587";
    private final String userm = "tprajapati502@gmail.com"; // your Gmail
    private final String pass = "euhe emoa cyva fdfw";
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private PasswordEncoder passwordEncoder1;
    public CustomerServiceImpl(CustomerRepository customerRepository, BCryptPasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Customer registerCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }


    @Override
    @Transactional
    public Customer updateCustomer(Integer id, UpdateProfileRequest dto) {

        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if(dto.getCustomerName() != null)
            existing.setCustomerName(dto.getCustomerName());

        if(dto.getCustomerPhone() != null)
            existing.setCustomerPhone(dto.getCustomerPhone());

        if(dto.getCustomerAddress() != null)
            existing.setCustomerAddress(dto.getCustomerAddress());

        if(dto.getEmergencyContact() != null)
            existing.setEmergencyContact(dto.getEmergencyContact());

        if(dto.getEmergencyName() != null)
            existing.setEmergencyName(dto.getEmergencyName());

        if(dto.getCustomerEmail() != null)
            existing.setCustomerEmail(dto.getCustomerEmail());


        if(dto.getAge() != null)
            existing.setCustomerAge(Integer.parseInt(dto.getAge()));


        if(dto.getIdProofType() != null)
            existing.setIdProofType(dto.getIdProofType());


        // ✅ REPLACE WITH THIS
        if(dto.getIdProofType() != null)
            existing.setIdProofType(dto.getIdProofType());

        if(dto.getIdProofDocument() != null)        // ✅ document path instead of number
            existing.setIdProofDocument(dto.getIdProofDocument());

        System.out.println("PROOF TYPE -> " + dto.getIdProofType());
        System.out.println("PROOF DOC  -> " + dto.getIdProofDocument()); // ✅ changed

//        if(existing.getPassword() == null){
//            throw new RuntimeException("Password missing in DB");
//        }
        System.out.println("EMAIL -> " + dto.getCustomerEmail());
        System.out.println("AGE -> " + dto.getAge());
        System.out.println("PROOF TYPE -> " + dto.getIdProofType());


        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }



    @Override
    public boolean changePassword(Integer customerId, String currentPassword, String newPassword) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // ✅ Verify current password matches
        if (!passwordEncoder1.matches(currentPassword, customer.getPassword())) {
            return false; // current password wrong
        }

        // ✅ Hash new password and save
        customer.setPassword(passwordEncoder1.encode(newPassword));
        customerRepository.save(customer);
        return true;
    }
    @Override
    public boolean verifySecurityAnswersAndSendPassword(
            String email,
            String favFood,
            String favSport) {

        Customer recipient = customerRepository.findByCustomerEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (recipient.getFavFood().equalsIgnoreCase(favFood) &&
                recipient.getFavSport().equalsIgnoreCase(favSport)) {

            // ✅ Generate new temporary password
            String tempPassword = generateTempPassword();

            // ✅ Hash it before saving
            String hashedPassword = passwordEncoder.encode(tempPassword);
            recipient.setPassword(hashedPassword);
            customerRepository.save(recipient);

            // ✅ Send the plain temp password to email
            String subject = "SpinCity — Password Reset";
            String content =
                    "Hello " + recipient.getCustomerName() + ",\n\n" +
                            "Your temporary password for SpinCity is:\n\n" +
                            "🔑 " + tempPassword + "\n\n" +
                            "Please login and change your password immediately.\n\n" +
                            "Team SpinCity";

            try {
                Properties props = new Properties();
                props.put("mail.smtp.host", host);
                props.put("mail.smtp.port", port);
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");

                Session session = Session.getInstance(props, new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(userm, pass);
                    }
                });

                Message msg = new MimeMessage(session);
                msg.setFrom(new InternetAddress(userm));
                msg.setRecipient(Message.RecipientType.TO,
                        new InternetAddress(recipient.getCustomerEmail()));
                msg.setSubject(subject);
                msg.setText(content);
                Transport.send(msg);

                System.out.println("✅ Password reset email sent!");
                return true;
            } catch (Exception e) {
                System.out.println("❌ Error: " + e.getMessage());
            }
        }
        return false;
    }

    // ✅ ADD THIS HELPER METHOD
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString(); // e.g. "Xk9mP2aQ"
    }

    @Override
    public boolean toggleNotifications(Integer customerId, boolean enabled) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setNotificationsEnabled(enabled);
        customerRepository.save(customer);
        System.out.println(">>> Notifications " + (enabled ? "enabled" : "disabled")
                + " for customer: " + customerId);
        return true;
    }

    @Override
    public void sendBulkNotification(String subject, String message) {
        // ✅ Fetch only customers with notifications enabled
        List<Customer> customers = customerRepository
                .findByNotificationsEnabled(true);

        System.out.println(">>> Sending notification to " + customers.size() + " customers");

        try {
            Properties props = new Properties();
            props.put("mail.smtp.host", host);
            props.put("mail.smtp.port", port);
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");

            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(userm, pass);
                }
            });

            for (Customer customer : customers) {
                try {
                    String content =
                            "Hello " + customer.getCustomerName() + ",\n\n" +
                                    message + "\n\n" +
                                    "Team SpinCity 🚲\n" +
                                    "To unsubscribe, go to Profile → Settings → Notifications";

                    Message msg = new MimeMessage(session);
                    msg.setFrom(new InternetAddress(userm));
                    msg.setRecipient(Message.RecipientType.TO,
                            new InternetAddress(customer.getCustomerEmail()));
                    msg.setSubject("SpinCity: " + subject);
                    msg.setText(content);
                    Transport.send(msg);

                    System.out.println("✅ Sent to: " + customer.getCustomerEmail());
                } catch (Exception e) {
                    System.out.println("❌ Failed for: " + customer.getCustomerEmail()
                            + " — " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.out.println("❌ Bulk notification error: " + e.getMessage());
        }
    }

    @Override
    public boolean sendContactEmail(String name, String email, String phone, String subject, String message) {
        try {
            Properties props = new Properties();
            props.put("mail.smtp.host", host);
            props.put("mail.smtp.port", port);
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");

            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(userm, pass);
                }
            });

            // ✅ Email 1 — Send to SpinCity support
            String supportContent =
                    "New Contact Form Submission\n\n" +
                            "Name: " + name + "\n" +
                            "Email: " + email + "\n" +
                            "Phone: " + (phone != null ? phone : "Not provided") + "\n" +
                            "Subject: " + (subject != null ? subject : "General Inquiry") + "\n\n" +
                            "Message:\n" + message;

            Message supportMsg = new MimeMessage(session);
            supportMsg.setFrom(new InternetAddress(userm));
            supportMsg.setRecipient(Message.RecipientType.TO, new InternetAddress(userm)); // send to yourself
            supportMsg.setSubject("SpinCity Contact: " + (subject != null ? subject : "New Message"));
            supportMsg.setText(supportContent);
            Transport.send(supportMsg);

            // ✅ Email 2 — Confirmation to user
            String userContent =
                    "Hello " + name + ",\n\n" +
                            "Thank you for contacting SpinCity! 🚲\n\n" +
                            "We have received your message and will get back to you within 24 hours.\n\n" +
                            "Your message:\n" + message + "\n\n" +
                            "Team SpinCity\n" +
                            "support@spincity.com";

            Message userMsg = new MimeMessage(session);
            userMsg.setFrom(new InternetAddress(userm));
            userMsg.setRecipient(Message.RecipientType.TO, new InternetAddress(email));
            userMsg.setSubject("We received your message — SpinCity");
            userMsg.setText(userContent);
            Transport.send(userMsg);

            System.out.println("✅ Contact emails sent successfully!");
            return true;

        } catch (Exception e) {
            System.out.println("❌ Contact email error: " + e.getMessage());
            return false;
        }
    }

}
