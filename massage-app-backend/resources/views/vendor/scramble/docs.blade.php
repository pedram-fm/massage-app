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
        docs.apiDescriptionDocument = spec;
    })();
</script>

{{-- ══════════════════════════════════════════════════════════════════ --}}
{{-- Auto-capture Bearer token after login and show it prominently      --}}
{{-- ══════════════════════════════════════════════════════════════════ --}}
<script>
    (function () {
        let capturedToken = localStorage.getItem('__API_TOKEN__') || null;
        
        // Restore token from previous session
        if (capturedToken) {
            console.info('🔐 Token restored from localStorage');
        }

        const originalFetch = window.fetch;

        window.fetch = async function (url, options = {}) {
            const urlString = typeof url === 'string' ? url : (url?.url || url?.href || '');

            // ═══ Step 1: Inject token into ALL outgoing requests ═══
            if (capturedToken) {
                options.headers = options.headers || {};
                const authValue = 'Bearer ' + capturedToken;
                
                if (options.headers instanceof Headers) {
                    if (!options.headers.has('Authorization')) {
                        options.headers.set('Authorization', authValue);
                    }
                } else if (Array.isArray(options.headers)) {
                    const hasAuth = options.headers.some(([k]) => k.toLowerCase() === 'authorization');
                    if (!hasAuth) options.headers.push(['Authorization', authValue]);
                } else {
                    if (!options.headers['Authorization'] && !options.headers['authorization']) {
                        options.headers['Authorization'] = authValue;
                    }
                }
            }

            // ═══ Step 2: Execute request ═══
            const response = await originalFetch(url, options);

            // ═══ Step 3: Capture token from auth responses ═══
            const isAuthEndpoint = 
                urlString.includes('/v1/auth/login') ||
                urlString.includes('/v1/auth/otp/verify') ||
                urlString.includes('/v1/auth/register');

            if (isAuthEndpoint && response.ok) {
                try {
                    const cloned = response.clone();
                    const json = await cloned.json();
                    const token = json?.data?.token || json?.token || json?.data?.access_token || json?.access_token;
                    
                    if (token && token !== capturedToken) {
                        capturedToken = token;
                        localStorage.setItem('__API_TOKEN__', token);
                        showTokenModal(token);
                    }
                } catch (_) { /* ignore */ }
            }

            return response;
        };

        // ═══ Show token in a copyable modal ═══
        function showTokenModal(token) {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:999999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
            
            const modal = document.createElement('div');
            modal.style.cssText = 'background:white;border-radius:12px;padding:32px;max-width:600px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);';
            
            modal.innerHTML = `
                <div style="font-family:system-ui,-apple-system,sans-serif;">
                    <div style="font-size:24px;font-weight:600;margin-bottom:8px;color:#059669;">
                        ✓ Authentication Successful
                    </div>
                    <div style="color:#6b7280;margin-bottom:20px;">
                        Your Bearer token has been captured. Use it in curl/Postman:
                    </div>
                    <div style="background:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;padding:16px;margin-bottom:16px;position:relative;">
                        <pre style="margin:0;font-family:ui-monospace,monospace;font-size:12px;color:#374151;overflow-x:auto;white-space:pre-wrap;word-break:break-all;">${token}</pre>
                        <button id="copyBtn" style="position:absolute;top:12px;right:12px;background:#3b82f6;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500;">
                            Copy
                        </button>
                    </div>
                    <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:12px;margin-bottom:20px;font-size:13px;color:#92400e;">
                        <strong>⚠️ Example curl:</strong><br>
                        <code style="font-size:11px;display:block;margin-top:8px;color:#78350f;">curl -H "Authorization: Bearer ${token.substring(0, 30)}..." http://localhost:8000/v1/admin/users</code>
                    </div>
                    <button id="closeBtn" style="width:100%;background:#10b981;color:white;border:none;padding:12px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">
                        Got it! Close
                    </button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Copy button
            modal.querySelector('#copyBtn').onclick = () => {
                navigator.clipboard.writeText(token).then(() => {
                    const btn = modal.querySelector('#copyBtn');
                    btn.textContent = '✓ Copied';
                    btn.style.background = '#10b981';
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.style.background = '#3b82f6';
                    }, 2000);
                });
            };

            // Close button
            modal.querySelector('#closeBtn').onclick = () => overlay.remove();
            overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        }

        // ═══ Add "Clear Token" button to page ═══
        const clearBtn = document.createElement('button');
        clearBtn.textContent = capturedToken ? '🔓 Clear Token' : '🔒 No Token';
        clearBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ef4444;color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        clearBtn.onclick = () => {
            if (capturedToken) {
                localStorage.removeItem('__API_TOKEN__');
                capturedToken = null;
                clearBtn.textContent = '🔒 No Token';
                clearBtn.style.background = '#6b7280';
                alert('Token cleared. You\'ll need to login again.');
            }
        };
        document.body.appendChild(clearBtn);
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
