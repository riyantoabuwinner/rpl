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

    public function getBaseUrl(): string
    {
        return $this->baseUrl . $this->loginEndpoint;
    }

    /**
     * Test connection to Portal API server
     */
    public function testConnection(): array
    {
        $endpoint = $this->baseUrl . $this->loginEndpoint;

        try {
            $startTime = microtime(true);
            $response = Http::acceptJson()
                ->timeout(3)
                ->get($this->baseUrl);

            $durationMs = round((microtime(true) - $startTime) * 1000, 2);

            return [
                'online' => $response->status() < 500,
                'status_code' => $response->status(),
                'duration_ms' => $durationMs,
                'endpoint' => $endpoint,
                'message' => 'Portal API server dapat dijangkau.',
            ];
        } catch (\Throwable $e) {
            $errorMsg = $e->getMessage();
            if (str_contains($errorMsg, 'cURL error 28') || str_contains($errorMsg, 'timed out')) {
                $userMsg = "Timeout (Waktu habis): Server Portal di [{$endpoint}] tidak merespons dalam 3 detik. Pastikan server Portal API sedang aktif atau sesuaikan PORTAL_BASE_URL di file .env.";
            } elseif (str_contains($errorMsg, 'cURL error 7') || str_contains($errorMsg, 'Connection refused')) {
                $userMsg = "Koneksi Ditolak: Tidak ada service yang aktif di [{$endpoint}]. Pastikan server Portal sudah dihidupkan.";
            } else {
                $userMsg = "Gagal terhubung: " . $errorMsg;
            }

            return [
                'online' => false,
                'status_code' => 500,
                'duration_ms' => 0,
                'endpoint' => $endpoint,
                'message' => $userMsg,
            ];
        }
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

            $errorMsg = $e->getMessage();
            if (str_contains($errorMsg, 'cURL error 28') || str_contains($errorMsg, 'timed out')) {
                $userMsg = "Waktu koneksi ke Portal API habis (Timeout). Server Portal di [{$url}] tidak merespons.";
            } elseif (str_contains($errorMsg, 'cURL error 7') || str_contains($errorMsg, 'Connection refused')) {
                $userMsg = "Koneksi ke Portal API ditolak. Server Portal di [{$url}] sedang offline.";
            } else {
                $userMsg = "Gagal menghubungi server Portal: " . $errorMsg;
            }

            return [
                'success' => false,
                'status_code' => 500,
                'message' => $userMsg,
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
