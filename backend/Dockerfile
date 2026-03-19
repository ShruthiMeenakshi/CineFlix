FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# copy maven files and source
COPY pom.xml mvnw* ./
COPY .mvn .mvn
COPY src src

# build the application
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
