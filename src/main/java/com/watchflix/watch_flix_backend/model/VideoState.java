package com.watchflix.watch_flix_backend.model;

public class VideoState {
    private String type;
    private Double currentTime;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(Double currentTime) {
        this.currentTime = currentTime;
    }
}