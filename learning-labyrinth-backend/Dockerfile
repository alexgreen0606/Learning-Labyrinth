# Build Stage
FROM docker.io/openjdk:17.0.2-slim-buster AS build

WORKDIR /app

COPY gradlew .
COPY gradle ./gradle

# Grant execute permissions to the Gradle wrapper JAR file
RUN chmod +x ./gradlew

# Copy only the necessary files for dependency resolution
COPY build.gradle settings.gradle /app/

# Resolve dependencies before copying the entire source code
RUN ./gradlew --no-daemon dependencies

# Copy the rest of the application source code
COPY . .

# Build the application
RUN ./gradlew build -x test
RUN ./gradlew shadowJar

# Final Stage
FROM docker.io/openjdk:17.0.2-slim-buster

WORKDIR /app

# Copy only the JAR file from the build stage
COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar /app/
COPY --from=build /app/build/libs/user-code-executor-0.0.1-SNAPSHOT.jar /app/

EXPOSE 8080

CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
