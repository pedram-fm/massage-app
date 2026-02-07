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

php -r '$host=getenv("DB_HOST") ?: "db"; $port=getenv("DB_PORT") ?: "5432"; $db=getenv("DB_DATABASE") ?: "postgres"; $user=getenv("DB_USERNAME") ?: "postgres"; $pass=getenv("DB_PASSWORD") ?: ""; $retries=60; while ($retries-- > 0) { try { new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass); exit(0); } catch (Throwable $e) { sleep(1); } } exit(1);'

composer install --no-interaction --prefer-dist
php artisan key:generate --force
php artisan config:clear
php artisan migrate --force

if [ ! -f storage/oauth-private.key ]; then
  php artisan passport:keys --force
fi

php artisan passport:client --personal --name="Personal Access Client" --no-interaction || true

if [ -f storage/oauth-private.key ]; then
  chmod 600 storage/oauth-private.key || true
fi
if [ -f storage/oauth-public.key ]; then
  chmod 600 storage/oauth-public.key || true
fi
