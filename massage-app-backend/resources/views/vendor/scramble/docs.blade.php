<!doctype html>
<html lang="en" data-theme="{{ $config->get('ui.theme', 'light') }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="color-scheme" content="{{ $config->get('ui.theme', 'light') }}">
    <title>{{ $config->get('ui.title', config('app.name') . ' - API Docs') }}</title>

    <script src="https://unpkg.com/@stoplight/elements@8.4.2/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements@8.4.2/styles.min.css">

    <script>
        const originalFetch = window.fetch;

        // intercept TryIt requests and add the XSRF-TOKEN header,
        // which is necessary for Sanctum cookie-based authentication to work correctly
        window.fetch = (url, options) => {
            const CSRF_TOKEN_COOKIE_KEY = "XSRF-TOKEN";
            const CSRF_TOKEN_HEADER_KEY = "X-XSRF-TOKEN";
            const getCookieValue = (key) => {
                const cookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith(key));
                return cookie?.split("=")[1];
            };

            const updateFetchHeaders = (
                headers,
                headerKey,
                headerValue,
            ) => {
                if (headers instanceof Headers) {
                    headers.set(headerKey, headerValue);
                } else if (Array.isArray(headers)) {
                    headers.push([headerKey, headerValue]);
                } else if (headers) {
                    headers[headerKey] = headerValue;
                }
            };
            const csrfToken = getCookieValue(CSRF_TOKEN_COOKIE_KEY);
            if (csrfToken) {
                const { headers = new Headers() } = options || {};
                updateFetchHeaders(headers, CSRF_TOKEN_HEADER_KEY, decodeURIComponent(csrfToken));
                return originalFetch(url, {
                    ...options,
                    headers,
                });
            }

            return originalFetch(url, options);
        };
    </script>

    <style>
        html, body { margin:0; height:100%; }
        body { background-color: var(--color-canvas); }
        /* issues about the dark theme of stoplight/mosaic-code-viewer using web component:
         * https://github.com/stoplightio/elements/issues/2188#issuecomment-1485461965
         */
        [data-theme="dark"] .token.property {
            color: rgb(128, 203, 196) !important;
        }
        [data-theme="dark"] .token.operator {
            color: rgb(255, 123, 114) !important;
        }
        [data-theme="dark"] .token.number {
            color: rgb(247, 140, 108) !important;
        }
        [data-theme="dark"] .token.string {
            color: rgb(165, 214, 255) !important;
        }
        [data-theme="dark"] .token.boolean {
            color: rgb(121, 192, 255) !important;
        }
        [data-theme="dark"] .token.punctuation {
            color: #dbdbdb !important;
        }
    </style>
</head>
<body style="height: 100vh; overflow-y: hidden">
<elements-api
    id="docs"
    tryItCredentialsPolicy="{{ $config->get('ui.try_it_credentials_policy', 'include') }}"
    router="hash"
    @if($config->get('ui.hide_try_it')) hideTryIt="true" @endif
    @if($config->get('ui.hide_schemas')) hideSchemas="true" @endif
    @if($config->get('ui.logo')) logo="{{ $config->get('ui.logo') }}" @endif
    @if($config->get('ui.layout')) layout="{{ $config->get('ui.layout') }}" @endif
/>
<script>
    (async () => {
        const docs = document.getElementById('docs');
        const spec = @json($spec);

        // ── Hierarchical tag groups for sidebar ──────────────
        spec['x-tagGroups'] = [
            {
                name: 'Auth',
                tags: ['Auth · Public', 'Auth · Protected'],
            },
            {
                name: 'Admin',
                tags: ['Admin · Dashboard', 'Admin · User Management'],
            },
            {
                name: 'Therapist',
                tags: ['Therapist'],
            },
            {
                name: 'Client',
                tags: ['Client'],
            },
            {
                name: 'System',
                tags: ['System · Logs'],
            },
        ];

        docs.apiDescriptionDocument = spec;
    })();
</script>

{{-- ── Auto-set Bearer token after login via Try It ────────── --}}
<script>
    (function () {
        const _fetch = window.fetch;

        window.fetch = async function (url, options) {
            const response = await _fetch(url, options);

            // Intercept login / OTP verify / register responses
            const urlStr = typeof url === 'string' ? url : url.url || '';
            const isAuthEndpoint =
                urlStr.includes('/v1/auth/login') ||
                urlStr.includes('/v1/auth/otp/verify') ||
                urlStr.includes('/v1/auth/register');

            if (isAuthEndpoint && response.ok) {
                try {
                    const cloned = response.clone();
                    const body = await cloned.json();
                    const token = body?.data?.token || body?.token;

                    if (token) {
                        // Store globally so subsequent Try It requests include it
                        window.__SCRAMBLE_BEARER_TOKEN__ = token;
                        console.info('[Scramble] Bearer token captured ✓');
                    }
                } catch (_) { /* non-JSON or no token — ignore */ }
            }

            return response;
        };

        // Patch fetch again to inject the stored bearer token into every request
        const _fetch2 = window.fetch;
        window.fetch = async function (url, options = {}) {
            if (window.__SCRAMBLE_BEARER_TOKEN__) {
                options.headers = options.headers || {};

                const setHeader = (headers, key, value) => {
                    if (headers instanceof Headers) {
                        if (!headers.has(key)) headers.set(key, value);
                    } else if (Array.isArray(headers)) {
                        if (!headers.some(([k]) => k.toLowerCase() === key.toLowerCase())) {
                            headers.push([key, value]);
                        }
                    } else {
                        if (!headers[key] && !headers[key.toLowerCase()]) {
                            headers[key] = value;
                        }
                    }
                };

                setHeader(options.headers, 'Authorization', 'Bearer ' + window.__SCRAMBLE_BEARER_TOKEN__);
            }

            return _fetch2(url, options);
        };
    })();
</script>

@if($config->get('ui.theme', 'light') === 'system')
    <script>
        var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        function updateTheme(e) {
            if (e.matches) {
                window.document.documentElement.setAttribute('data-theme', 'dark');
                window.document.getElementsByName('color-scheme')[0].setAttribute('content', 'dark');
            } else {
                window.document.documentElement.setAttribute('data-theme', 'light');
                window.document.getElementsByName('color-scheme')[0].setAttribute('content', 'light');
            }
        }

        mediaQuery.addEventListener('change', updateTheme);
        updateTheme(mediaQuery);
    </script>
@endif
</body>
</html>
