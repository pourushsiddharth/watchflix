document.addEventListener('DOMContentLoaded', () => {
    // --- NEW: Get Room and User info from the URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user') || 'Guest' + Math.floor(Math.random() * 1000);
    const roomId = urlParams.get('room');

    // If no room ID is in the URL, the user shouldn't be here. Send them to the join page.
    if (!roomId) {
        window.location.href = 'join.html'; // Or whatever your join page is named
        return;
    }

    // --- Player & Chat Elements ---
    const playerContainer = document.querySelector('.player-container'); // Updated selector
    const video = document.getElementById('main-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const pipBtn = document.getElementById('pip-btn');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('messages-container');
    const unmuteOverlay = document.getElementById('unmute-overlay'); // Make sure you have this element in your HTML

    // --- WebSocket State ---
    let stompClient = null;
    let isConnected = false;
    let isServerEvent = false;

    function connect() {
        const socket = new SockJS('http://localhost:8080/ws'); // Ensure this port is correct
        stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, () => {
            isConnected = true;
            console.log('✅ Connected to WebSocket and joined room:', roomId);

            // UPDATED: Subscribe to room-specific topics
            stompClient.subscribe(`/topic/room/${roomId}/video`, (message) => {
                handleVideoSync(JSON.parse(message.body));
            });
            stompClient.subscribe(`/topic/room/${roomId}/chat`, (message) => {
                displayChatMessage(JSON.parse(message.body));
            });

            // NEW: Request the current video state from the server for this room
            stompClient.send(`/app/video.requestSync/${roomId}`, {}, {});
            console.log('🚀 Sent request for initial video state.');

        }, () => {
            isConnected = false;
            console.error('❌ WebSocket connection failed. Retrying in 5 seconds...');
            setTimeout(connect, 5000);
        });
    }

    function handleVideoSync(state) {
        isServerEvent = true;
        switch (state.type) {
            case 'PLAY':
                video.play().catch(e => console.warn("Play interrupted:", e));
                break;
            case 'PAUSE':
                video.pause();
                break;
            case 'SEEK':
                // Only seek if the time difference is significant to prevent jitter
                if (Math.abs(video.currentTime - state.currentTime) > 1.5) {
                    console.log(`Syncing seek to: ${state.currentTime}`);
                    video.currentTime = state.currentTime;
                }
                break;
        }
        // Use a timeout to reset the flag, allowing local events to fire again shortly
        setTimeout(() => { isServerEvent = false; }, 150);
    }

    function displayChatMessage(message) {
        const chatMessageDiv = document.createElement('div');
        chatMessageDiv.className = 'chat-message';
        // Using the same beautiful chat bubble format
        chatMessageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <span class="message-user">${message.user}</span>
                    <span class="message-options">
                        <i class="material-icons" style="font-size: 18px;">more_horiz</i>
                    </span>
                </div>
                <p class="message-content">${message.content}</p>
            </div>
        `;
        messagesContainer.appendChild(chatMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function togglePlayPause() {
        if (!isConnected || isServerEvent) return;
        const action = video.paused ? 'PLAY' : 'PAUSE';
        // UPDATED: Send to room-specific endpoint
        stompClient.send(`/app/video.sync/${roomId}`, {}, JSON.stringify({ type: action }));
    }

    function updatePlayPauseIcon() {
        const icon = video.paused ? 'play_arrow' : 'pause';
        if (playPauseBtn) {
            playPauseBtn.querySelector('i.material-icons').textContent = icon;
        }
    }

    function updateProgress() {
        if (!progressBar || !currentTimeEl || isNaN(video.duration)) return;
        progressBar.value = (video.currentTime / video.duration) * 100;
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${String(seconds).padStart(2, '0')}`;
        };
        currentTimeEl.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen().catch((err) => console.error(err));
        } else {
            document.exitFullscreen();
        }
    }

    function sendMessage() {
        const content = chatInput.value;
        if (content.trim() && isConnected) {
            // UPDATED: Use the real username and send to room-specific endpoint
            const chatMessage = { user: username, content: content.trim() };
            stompClient.send(`/app/chat.sendMessage/${roomId}`, {}, JSON.stringify(chatMessage));
            chatInput.value = '';
        }
    }

    // --- Event Listeners ---

    if (unmuteOverlay) {
        unmuteOverlay.addEventListener('click', () => {
            video.muted = false;
            unmuteOverlay.classList.add('hidden');
            if (video.paused) {
                togglePlayPause();
            }
        });
    }

    video.addEventListener('click', togglePlayPause);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);
    video.addEventListener('play', updatePlayPauseIcon);
    video.addEventListener('pause', updatePlayPauseIcon);

    // This handles seeking via the progress bar
    if (progressBar) {
        progressBar.addEventListener('change', () => {
            if (!isConnected || isServerEvent) return;
            const newTime = (progressBar.value / 100) * video.duration;
            stompClient.send(`/app/video.sync/${roomId}`, {}, JSON.stringify({
                type: 'SEEK',
                currentTime: newTime
            }));
        });
    }

    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (pipBtn) pipBtn.addEventListener('click', () => video.requestPictureInPicture().catch(() => {}));
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keyup', (e) => e.key === 'Enter' && sendMessage());

    // --- Initial Connection ---
    connect();
});
