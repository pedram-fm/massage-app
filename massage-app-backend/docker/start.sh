#!/bin/sh
set -e

if [ ! -f .env ]; then
  cp .env.example .env 2>/dev/null || true
fi

if ! grep -q '^APP_KEY=' .env; then
  echo 'APP_KEY=' >> .env
fi

mkdir -p bootstrap/cache storage/framework/cache storage/framework/sessions storage/framework/views storage/logs
chmod -R 777 bootstrap/cache storage || true

# Ensure DB settings in .env match compose
grep -q '^DB_CONNECTION=' .env && sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=pgsql/' .env || echo 'DB_CONNECTION=pgsql' >> .env
grep -q '^DB_HOST=' .env && sed -i 's/^DB_HOST=.*/DB_HOST=db/' .env || echo 'DB_HOST=db' >> .env
grep -q '^DB_PORT=' .env && sed -i 's/^DB_PORT=.*/DB_PORT=5432/' .env || echo 'DB_PORT=5432' >> .env
grep -q '^DB_DATABASE=' .env && sed -i 's/^DB_DATABASE=.*/DB_DATABASE=massage_app/' .env || echo 'DB_DATABASE=massage_app' >> .env
grep -q '^DB_USERNAME=' .env && sed -i 's/^DB_USERNAME=.*/DB_USERNAME=pedram/' .env || echo 'DB_USERNAME=pedram' >> .env
grep -q '^DB_PASSWORD=' .env && sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=pedram_fm/' .env || echo 'DB_PASSWORD=pedram_fm' >> .env

# Avoid stale cached config pointing to sqlite
rm -f bootstrap/cache/config.php bootstrap/cache/services.php bootstrap/cache/packages.php 2>/dev/null || true

if [ -f storage/oauth-private.key ]; then
  chmod 600 storage/oauth-private.key || true
fi
if [ -f storage/oauth-public.key ]; then
  chmod 600 storage/oauth-public.key || true
fi

php artisan serve --host=0.0.0.0 --port=8000
