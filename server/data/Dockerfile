FROM postgres:15

ENV POSTGRES_USER=abderrahim
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=matcha

COPY database.sql /docker-entrypoint-initdb.d/init-db.sql

EXPOSE 5432
