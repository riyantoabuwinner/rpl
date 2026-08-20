<?php

namespace App\Integrations\Portal;

use App\Enums\IntegrationStatus;
use App\Models\IntegrationLog;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PortalClient
{
    protected string $baseUrl;
    protected string $loginEndpoint;
    protected int $timeout;
    protected int $retryTimes;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.portal.base_url', 'http://localhost:8000/api/v2/portal'), '/');
        $this->loginEndpoint = '/' . ltrim(config('services.portal.login_endpoint', '/login'), '/');
        $this->timeout = (int) config('services.portal.timeout', 15);
        $this->retryTimes = (int) config('services.portal.retry_times', 1);
    }

    /**
     * Authenticate user via Portal API
     * POST /api/v2/portal/login
     * Content-Type: application/x-www-form-urlencoded
     * Accept: application/json
     */
    public function login(string $username, string $password): array
    {
        $endpoint = $this->baseUrl . $this->loginEndpoint;
        $requestId = (string) Str::uuid();
        $payload = [
            'username' => $username,
            'password' => $password,
        ];

        return $this->sendRequest(
            method: 'POST',
            url: $endpoint,
            params: $payload,
            action: 'PortalLogin',
            requestId: $requestId
        );
    }

    /**
     * Centralized HTTP Request dispatcher for Portal API
     */
    protected function sendRequest(
        string $method,
        string $url,
        array $params,
        string $action,
        string $requestId,
        ?int $actorId = null
    ): array {
        $payloadHash = hash('sha256', json_encode($params) . $url);

        $log = IntegrationLog::create([
            'id' => (string) Str::uuid(),
            'target_system' => 'PORTAL',
            'action' => $action,
            'request_id' => $requestId,
            'payload_hash' => $payloadHash,
            'payload_sanitized' => $this->sanitizePayload($params),
            'status' => IntegrationStatus::PROCESSING,
            'retry_count' => 0,
            'actor_id' => $actorId ?? auth()->id(),
        ]);

        $attempt = 0;

        try {
            $response = Http::acceptJson()
                ->asForm() // application/x-www-form-urlencoded
                ->timeout($this->timeout)
                ->retry($this->retryTimes, 300, function ($exception) use (&$attempt, $log) {
                    $attempt++;
                    $log->update(['retry_count' => $attempt, 'status' => IntegrationStatus::RETRYING]);
                    Log::warning("Portal API Request failed (Attempt #{$attempt}): " . $exception->getMessage());
                    return $exception instanceof ConnectionException || $exception instanceof RequestException;
                })
                ->send($method, $url, [
                    'form_params' => $params,
                ]);

            $statusCode = $response->status();
            $body = $response->json();

            if ($response->successful() && is_array($body)) {
                // Check if API returned an internal error / failure flag in JSON
                $isExplicitSuccess = !isset($body['status']) || in_array(strtolower((string)$body['status']), ['success', 'true', 'ok', '1', '200']);
                if (isset($body['success']) && $body['success'] === false) {
                    $isExplicitSuccess = false;
                }

                if ($isExplicitSuccess) {
                    $log->update([
                        'status' => IntegrationStatus::SUCCESS,
                        'response_code' => $statusCode,
                        'response_message' => 'OK',
                        'response_body' => $this->sanitizeResponseBody($body),
                    ]);

                    return [
                        'success' => true,
                        'status_code' => $statusCode,
                        'data' => $body,
                        'request_id' => $requestId,
                        'message' => $body['message'] ?? 'Login berhasil.',
                    ];
                }
            }

            // Unsuccessful API response
            $errorMessage = $body['message'] ?? ($body['error'] ?? "Portal API returned status {$statusCode}");
            $log->update([
                'status' => IntegrationStatus::FAILED,
                'response_code' => $statusCode,
                'response_message' => is_string($errorMessage) ? $errorMessage : json_encode($errorMessage),
                'response_body' => is_array($body) ? $this->sanitizeResponseBody($body) : ['raw' => $response->body()],
            ]);

            return [
                'success' => false,
                'status_code' => $statusCode,
                'message' => is_string($errorMessage) ? $errorMessage : 'Autentikasi Portal gagal.',
                'data' => $body,
                'request_id' => $requestId,
            ];
        } catch (\Throwable $e) {
            $log->update([
                'status' => IntegrationStatus::FAILED,
                'response_code' => 500,
                'response_message' => $e->getMessage(),
                'response_body' => ['exception' => get_class($e), 'message' => $e->getMessage()],
            ]);

            Log::error("Portal Client Critical Error [{$action}]: " . $e->getMessage(), [
                'request_id' => $requestId,
                'url' => $url,
            ]);

            return [
                'success' => false,
                'status_code' => 500,
                'message' => 'Gagal menghubungi server Portal: ' . $e->getMessage(),
                'data' => null,
                'request_id' => $requestId,
            ];
        }
    }

    /**
     * Sanitize sensitive request parameters
     */
    protected function sanitizePayload(array $payload): array
    {
        $sensitiveKeys = ['password', 'secret', 'token', 'access_token', 'authorization', 'pass'];
        $sanitized = [];

        foreach ($payload as $key => $value) {
            if (in_array(strtolower((string)$key), $sensitiveKeys)) {
                $sanitized[$key] = '********';
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizePayload($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Sanitize sensitive response fields
     */
    protected function sanitizeResponseBody(array $body): array
    {
        $sensitiveKeys = ['password', 'secret', 'two_factor_secret'];
        $sanitized = [];

        foreach ($body as $key => $value) {
            if (in_array(strtolower((string)$key), $sensitiveKeys)) {
                $sanitized[$key] = '********';
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizeResponseBody($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
