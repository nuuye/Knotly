# syntax=docker/dockerfile:1

FROM maven:3.9.11-eclipse-temurin-21-alpine AS build

WORKDIR /workspace

COPY pom.xml ./
COPY src ./src

# BuildKit keeps Maven dependencies between builds without adding them to the image.
RUN --mount=type=cache,target=/root/.m2 \
    mvn --batch-mode --define skipTests package

FROM eclipse-temurin:21-jre-alpine

# Curl is used by the container healthcheck.
RUN apk add --no-cache curl \
    && addgroup --system spring \
    && adduser --system --ingroup spring spring

WORKDIR /app

COPY --from=build --chown=spring:spring /workspace/target/*.jar app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
