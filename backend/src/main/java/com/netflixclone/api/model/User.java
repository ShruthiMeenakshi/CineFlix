package com.netflixclone.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Users")
public class User {

    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String displayName;
    private boolean notificationsEmail;
    private boolean notificationsPush;
    private boolean notificationsMarketing;
    private boolean autoplay;
    private String playbackQuality;
    private java.util.List<String> preferredGenres;
    private java.util.List<String> preferredLanguages;
    private String maturityRating;

    public User() {}

    public User(String username, String password, String email, String displayName) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.displayName = displayName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public boolean isNotificationsEmail() { return notificationsEmail; }
    public void setNotificationsEmail(boolean notificationsEmail) { this.notificationsEmail = notificationsEmail; }

    public boolean isNotificationsPush() { return notificationsPush; }
    public void setNotificationsPush(boolean notificationsPush) { this.notificationsPush = notificationsPush; }

    public boolean isNotificationsMarketing() { return notificationsMarketing; }
    public void setNotificationsMarketing(boolean notificationsMarketing) { this.notificationsMarketing = notificationsMarketing; }

    public boolean isAutoplay() { return autoplay; }
    public void setAutoplay(boolean autoplay) { this.autoplay = autoplay; }

    public String getPlaybackQuality() { return playbackQuality; }
    public void setPlaybackQuality(String playbackQuality) { this.playbackQuality = playbackQuality; }

    public java.util.List<String> getPreferredGenres() { return preferredGenres; }
    public void setPreferredGenres(java.util.List<String> preferredGenres) { this.preferredGenres = preferredGenres; }

    public java.util.List<String> getPreferredLanguages() { return preferredLanguages; }
    public void setPreferredLanguages(java.util.List<String> preferredLanguages) { this.preferredLanguages = preferredLanguages; }

    public String getMaturityRating() { return maturityRating; }
    public void setMaturityRating(String maturityRating) { this.maturityRating = maturityRating; }
}
