FROM docker.arvancloud.ir/php:8.4-fpm

RUN if [ -f /etc/apt/sources.list ]; then \
        sed -i 's|http://deb.debian.org/debian|http://mirror.arvancloud.ir/debian|g' /etc/apt/sources.list && \
        sed -i 's|http://security.debian.org/debian-security|http://mirror.arvancloud.ir/debian-security|g' /etc/apt/sources.list; \
    elif [ -f /etc/apt/sources.list.d/debian.sources ]; then \
        sed -i 's|http://deb.debian.org/debian|http://mirror.arvancloud.ir/debian|g' /etc/apt/sources.list.d/debian.sources && \
        sed -i 's|http://security.debian.org/debian-security|http://mirror.arvancloud.ir/debian-security|g' /etc/apt/sources.list.d/debian.sources; \
    fi \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        curl \
        unzip \
        postgresql-client \
        libpq-dev \
        libzip-dev \
    && docker-php-ext-install pdo_pgsql bcmath zip pcntl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=docker.arvancloud.ir/composer:2 /usr/bin/composer /usr/local/bin/composer
COPY ./docker/php-dev.ini /usr/local/etc/php/conf.d/zz-dev.ini

WORKDIR /var/www
