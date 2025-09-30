package com.watchflix.watch_flix_backend.model;

public class SignalMessage {

    private String type;
    private Object data;
    private String sender; // NEW: Add this field

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
    public String getSender() { return sender; } // NEW: Add this getter
    public void setSender(String sender) { this.sender = sender; } // NEW: Add this setter
}