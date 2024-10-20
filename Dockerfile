FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew

RUN ./gradlew clean build -x test

ENTRYPOINT ["java", "-Xdebug","-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-jar", "build/libs/Goraebab-0.0.1-SNAPSHOT.jar"]