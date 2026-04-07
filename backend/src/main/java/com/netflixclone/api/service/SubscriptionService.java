package com.netflixclone.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public SubscriptionService(
            JavaMailSender mailSender,
            @Value("${spring.mail.from:no-reply@cineflix.local}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendThankYou(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(fromAddress);
        message.setSubject("Thanks for subscribing to CineFlix");
        message.setText(buildBody(toEmail));
        mailSender.send(message);
    }

    private String buildBody(String email) {
        return "Hi,\n\n"
                + "Thanks for subscribing to CineFlix. You are now on the list for updates,"
                + " new releases, and personalized recommendations.\n\n"
                + "If you did not request this, you can ignore this email.\n\n"
                + "Cheers,\n"
                + "The CineFlix Team\n";
    }
}
