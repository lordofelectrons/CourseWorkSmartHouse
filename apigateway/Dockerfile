FROM maven:3.6.3-jdk-13 AS build
COPY pom.xml /tmp/
RUN mvn -B dependency:go-offline -f /tmp/pom.xml -s /usr/share/maven/ref/settings-docker.xml
COPY src /tmp/src/

WORKDIR /tmp/
RUN mvn -B -s /usr/share/maven/ref/settings-docker.xml package

FROM openjdk:13-jdk-alpine
EXPOSE 8081

RUN mkdir /app
COPY --from=build /tmp/target/*.jar /app/app.jar
COPY src/main/resources/* ./

RUN apk add --no-cache bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

CMD ./wait-for-it.sh discovery-server:8761 --strict -- java -jar /app/app.jar