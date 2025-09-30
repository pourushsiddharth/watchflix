package com.watchflix.watch_flix_backend.controller;

import com.watchflix.watch_flix_backend.model.VideoState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

// NEW: Import the necessary Map classes
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class VideoSyncController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // NEW: A map to store the last known video state for each room.
    // This acts as the server's "memory" of what's happening in each room.
    private final Map<String, VideoState> roomStates = new ConcurrentHashMap<>();

    /**
     * Handles incoming video state messages (PLAY, PAUSE, SEEK).
     * It now ALSO stores this state as the latest for the room.
     */
    @MessageMapping("/video.sync/{roomId}")
    public void syncVideo(@DestinationVariable String roomId, VideoState videoState) {
        // NEW: Store the latest state (play, pause, or seek time) for this room.
        if (videoState != null && videoState.getType() != null) {
            roomStates.put(roomId, videoState);
        }

        // Manually broadcast the message to the room-specific topic.
        String topic = "/topic/room/" + roomId + "/video";
        messagingTemplate.convertAndSend(topic, videoState);
    }

    /**
     * NEW: This method handles requests from new users asking for the current video state.
     * The frontend will call this as soon as it connects.
     */
    @MessageMapping("/video.requestSync/{roomId}")
    public void requestSync(@DestinationVariable String roomId) {
        // Get the last saved state for the room from our "memory".
        VideoState lastState = roomStates.get(roomId);

        // If a state exists (i.e., the video has been played/paused/seeked before),
        // send it to everyone in the room. New users will sync up to this state.
        if (lastState != null) {
            String topic = "/topic/room/" + roomId + "/video";
            messagingTemplate.convertAndSend(topic, lastState);
        }
    }
}