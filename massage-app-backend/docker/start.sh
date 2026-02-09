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

# Ensure Passport keys exist without relying on artisan
if [ ! -f storage/oauth-private.key ] || [ ! -f storage/oauth-public.key ]; then
  php -r '
    $storage = __DIR__ . "/../storage";
    $private = $storage . "/oauth-private.key";
    $public = $storage . "/oauth-public.key";
    if (!is_dir($storage)) { @mkdir($storage, 0777, true); }
    if (is_readable($private) && is_readable($public)) { exit(0); }
    if (!function_exists("openssl_pkey_new")) { exit(0); }
    $res = openssl_pkey_new(["private_key_bits"=>2048,"private_key_type"=>OPENSSL_KEYTYPE_RSA]);
    if ($res === false) { exit(0); }
    $priv = "";
    if (!openssl_pkey_export($res, $priv)) { exit(0); }
    $details = openssl_pkey_get_details($res);
    $pub = $details["key"] ?? null;
    if (!$pub) { exit(0); }
    @file_put_contents($private, $priv);
    @file_put_contents($public, $pub);
    @chmod($private, 0600);
    @chmod($public, 0600);
  ' || true
fi

# Ensure migrations (including sessions table) are applied on container start
php artisan migrate --force

# Ensure Personal Access Client exists (needed for token issuance)
php artisan passport:client --personal --name="Personal Access Client" --no-interaction || true

if [ -f storage/oauth-private.key ]; then
  chown www-data:www-data storage/oauth-private.key 2>/dev/null || true
  chmod 600 storage/oauth-private.key || true
fi
if [ -f storage/oauth-public.key ]; then
  chown www-data:www-data storage/oauth-public.key 2>/dev/null || true
  chmod 600 storage/oauth-public.key || true
fi

# Ensure Passport keys exist (avoid manual commands after container starts)
if [ ! -f storage/oauth-private.key ] || [ ! -f storage/oauth-public.key ]; then
  php artisan passport:keys --force
fi

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

php artisan serve --host=0.0.0.0 --port=8000
