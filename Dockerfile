# Use OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the jar file after Maven build
COPY target/*.jar app.jar

# Expose the port Render will use
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
