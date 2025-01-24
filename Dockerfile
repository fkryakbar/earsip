FROM serversideup/php:8.3-unit


WORKDIR /var/www/html

COPY . .
COPY ./.env.production .env

USER root

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

USER www-data