# WatchFlix 🎬

A real-time social streaming platform that enables synchronized video watching with friends, featuring live chat and WebRTC-based video/audio communication.

## 📖 Project Description

WatchFlix is a Spring Boot-based web application that allows multiple users to watch videos together in perfect synchronization. Users can create or join watch parties, communicate through real-time chat, and use WebRTC for peer-to-peer audio/video communication, creating an immersive shared viewing experience.

## ✨ Features

- **Synchronized Video Playback**: Watch videos together with friends in real-time synchronization
- **Real-time Chat**: Communicate with other viewers through WebSocket-powered chat
- **WebRTC Integration**: Peer-to-peer video and audio communication
- **Video State Management**: Automatic synchronization of play, pause, seek, and playback speed
- **Join Room System**: Easy room creation and joining mechanism
- **Responsive Design**: Works seamlessly across different devices
- **Low Latency**: WebSocket-based communication for instant updates

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot** - Application framework
- **Spring WebSocket** - Real-time bidirectional communication
- **STOMP Protocol** - Messaging protocol over WebSocket
- **Maven** - Dependency management and build tool

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript (ES6+)** - Client-side logic
- **WebRTC API** - Peer-to-peer communication
- **STOMP.js** - WebSocket client library

### Deployment
- **Docker** - Containerization
- **Render** - Cloud hosting platform

## 📁 Project Structure

```
watchflix/
├── src/
│   ├── main/
│   │   ├── java/com/watchflix/watch_flix_backend/
│   │   │   ├── controller/
│   │   │   │   ├── ChatController.java
│   │   │   │   ├── VideoSyncController.java
│   │   │   │   └── WebRTCSignalingController.java
│   │   │   ├── model/
│   │   │   │   ├── ChatMessage.java
│   │   │   │   ├── SignalMessage.java
│   │   │   │   └── VideoState.java
│   │   │   ├── WatchFlixBackendApplication.java
│   │   │   └── WebSocketConfig.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── join.html
│   │       │   ├── player.html
│   │       │   ├── script.js
│   │       │   └── style.css
│   │       └── application.properties
│   └── test/
├── Dockerfile
├── pom.xml
└── mvnw
```

## 🚀 Installation

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker (optional, for containerized deployment)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/pourushsiddharth/watchflix.git
   cd watchflix
   ```

2. **Build the project**
   ```bash
   ./mvnw clean install
   ```
   Or on Windows:
   ```bash
   mvnw.cmd clean install
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   Or:
   ```bash
   java -jar target/*.jar
   ```

4. **Access the application**
   - Open your browser and navigate to http://localhost:8080
   - Start with the join page: http://localhost:8080/join.html

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build the application first
./mvnw clean package

# Build Docker image
docker build -t watchflix:latest .
```

### Run Docker Container

```bash
docker run -p 8080:8080 watchflix:latest
```

## 💻 Usage

### Creating/Joining a Watch Party

1. Navigate to http://localhost:8080/join.html
2. Enter your desired room ID
3. Click "Join Room" to enter the watch party
4. Share the room ID with friends so they can join

### Video Synchronization

- **Play/Pause**: All connected users will see the same play/pause state
- **Seek**: When one user seeks to a different timestamp, all viewers sync automatically
- **Speed Control**: Playback speed changes are synchronized across all viewers

### Chat Features

- Type your message in the chat input box
- Press Enter or click Send to share with all participants
- All messages appear in real-time for all connected users

### WebRTC Communication

- Enable camera/microphone when prompted
- Video feeds from other participants appear automatically
- Audio/video communication happens peer-to-peer for optimal quality

## 🔌 API Endpoints

### WebSocket Endpoints

#### Chat

- **Subscribe**: /topic/chat/{roomId}
- **Send**: /app/chat/{roomId}
- **Message Format**:
  ```json
  {
    "sender": "username",
    "content": "message text",
    "timestamp": "ISO-8601 timestamp"
  }
  ```

#### Video Synchronization

- **Subscribe**: /topic/video-sync/{roomId}
- **Send**: /app/video-sync/{roomId}
- **Video State Format**:
  ```json
  {
    "action": "play|pause|seek|speed",
    "currentTime": 123.45,
    "playbackRate": 1.0,
    "timestamp": "ISO-8601 timestamp"
  }
  ```

#### WebRTC Signaling

- **Subscribe**: /topic/webrtc/{roomId}
- **Send**: /app/webrtc/{roomId}
- **Signal Types**: offer, answer, ice-candidate

## 🌐 Deployment

### Deploying to Render

1. Create a new Web Service on [Render](https://render.com/)
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `./mvnw clean package`
   - Start Command: `java -jar target/*.jar`
   - Environment: Docker (or Native)
4. Set environment variables (if needed):
   - `SERVER_PORT`: 8080
5. Deploy and wait for the build to complete

### Environment Variables

```bash
SERVER_PORT=8080
SPRING_WEBSOCKET_MESSAGE_SIZE_LIMIT=65536
```

## 🧪 Testing

Run the test suite:
```bash
./mvnw test
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

### Contribution Guidelines

- Write clear, descriptive commit messages
- Follow Java coding conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 👤 Author

**Pourush Siddharth**

- GitHub: [@pourushsiddharth](https://github.com/pourushsiddharth)

## 🙏 Acknowledgments

- Spring Framework team for excellent documentation
- WebRTC community for peer-to-peer communication standards
- All contributors who help improve this project

## 📧 Support

If you have any questions or run into issues, please:

- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🗺️ Roadmap

- [ ] User authentication and profiles
- [ ] Video upload and hosting
- [ ] Room privacy settings (public/private)
- [ ] Screen sharing capability
- [ ] Recording watch parties
- [ ] Mobile app development
- [ ] Enhanced UI/UX improvements
- [ ] Multiple video source support

---

**Made with ❤️ by Pourush Siddharth**
