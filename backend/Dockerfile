FROM openjdk:8-jdk-alpine
COPY build/libs/*.jar /backend/backend.jar
WORKDIR /backend
ENV PORT=8080
CMD java $JAVA_OPTS -jar ./backend.jar --server.port=$PORT