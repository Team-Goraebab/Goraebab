FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew

RUN ./gradlew clean build -x test

ENTRYPOINT ["java", "-jar", "build/libs/Goraebab-0.0.1-SNAPSHOT.jar"]