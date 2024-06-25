FROM openjdk:24-jdk-oracle
COPY target/*jar spring-boot-sample-todo-application-0.0.1-SNAPSHOT.jar
EXPOSE 8089
ENTRYPOINT ["java", "-jar", "spring-boot-sample-todo-application-0.0.1-SNAPSHOT.jar"]