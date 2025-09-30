package com.watchflix.watch_flix_backend.controller;

import com.watchflix.watch_flix_backend.model.SignalMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebRTCSignalingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Relays WebRTC signaling messages to other users in the same room.
     */
    @MessageMapping("/webrtc.signal/{roomId}")
    public void handleSignal(@DestinationVariable String roomId, SignalMessage signalMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Get the session ID of the sender
        String senderSessionId = headerAccessor.getSessionId();

        // The topic to broadcast to. The frontend will handle ignoring its own messages.
        String topic = "/topic/room/" + roomId + "/webrtc.signal";

        // Broadcast the signal message to everyone in the room.
        messagingTemplate.convertAndSend(topic, signalMessage);
    }
}