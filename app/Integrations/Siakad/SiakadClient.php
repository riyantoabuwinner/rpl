<?php

namespace App\Integrations\Siakad;

use App\Enums\IntegrationStatus;
use App\Models\IntegrationLog;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SiakadClient
{
    protected string $baseUrl;
    protected string $token;
    protected int $timeout;
    protected int $retryTimes;
    protected int $retrySleep;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.siakad.base_url', 'https://bridge.uinssc.ac.id/api'), '/');
        $this->token = config('services.siakad.token', 'ptipd-access-token');
        $this->timeout = (int) config('services.siakad.timeout', 30);
        $this->retryTimes = (int) config('services.siakad.retry_times', 3);
        $this->retrySleep = (int) config('services.siakad.retry_sleep', 500);
    }

    /**
     * Fetch Program Studi from SIAKAD Bridge
     * Endpoint: GET /program_studi?fakultas={fakultas}
     */
    public function getProgramStudi(?string $fakultas = null, ?int $actorId = null): array
    {
        $endpoint = $this->baseUrl . '/program_studi';
        $queryParams = array_filter(['fakultas' => $fakultas]);
        $requestId = (string) Str::uuid();

        return $this->sendRequest(
            method: 'GET',
            url: $endpoint,
            params: $queryParams,
            action: 'FetchProgramStudi',
            requestId: $requestId,
            actorId: $actorId
        );
    }

    /**
     * Fetch Mata Kuliah for a Program Studi from SIAKAD Bridge
     * Endpoint: POST /matakuliah with ['kode_prodi' => $kodeProdi]
     */
    public function getMataKuliah(string $kodeProdi, ?int $actorId = null): array
    {
        $endpoint = $this->baseUrl . '/matakuliah';
        $payload = ['kode_prodi' => $kodeProdi];
        $requestId = (string) Str::uuid();

        return $this->sendRequest(
            method: 'POST',
            url: $endpoint,
            params: $payload,
            action: 'FetchMataKuliah',
            requestId: $requestId,
            actorId: $actorId
        );
    }

    /**
     * Centralized HTTP Dispatcher with Retry, Timeout, and Structured Logging
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

        // Create initial integration log
        $log = IntegrationLog::create([
            'id' => (string) Str::uuid(),
            'target_system' => 'SIAKAD',
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
            $response = Http::withToken($this->token)
                ->timeout($this->timeout)
                ->retry($this->retryTimes, $this->retrySleep, function ($exception, $request) use (&$attempt, $log) {
                    $attempt++;
                    $log->update(['retry_count' => $attempt, 'status' => IntegrationStatus::RETRYING]);
                    Log::warning("SIAKAD API Request failed (Attempt #{$attempt}): " . $exception->getMessage());
                    return $exception instanceof ConnectionException || $exception instanceof RequestException;
                })
                ->asForm() // Support form-data/x-www-form-urlencoded matching cURL sample
                ->send($method, $url, [
                    ($method === 'GET' ? 'query' : 'form_params') => $params,
                ]);

            $statusCode = $response->status();
            $body = $response->json() ?? ['raw' => $response->body()];

            if ($response->successful()) {
                $log->update([
                    'status' => IntegrationStatus::SUCCESS,
                    'response_code' => $statusCode,
                    'response_message' => 'OK',
                    'response_body' => is_array($body) ? $body : ['content' => $body],
                ]);

                return [
                    'success' => true,
                    'status_code' => $statusCode,
                    'data' => $body,
                    'request_id' => $requestId,
                ];
            }

            // Unsuccessful HTTP response
            $log->update([
                'status' => IntegrationStatus::FAILED,
                'response_code' => $statusCode,
                'response_message' => $response->body(),
                'response_body' => is_array($body) ? $body : ['error' => $response->body()],
            ]);

            return [
                'success' => false,
                'status_code' => $statusCode,
                'message' => "SIAKAD API HTTP {$statusCode}: " . $response->body(),
                'data' => $body,
                'request_id' => $requestId,
            ];
        } catch (\Throwable $e) {
            $log->update([
                'status' => IntegrationStatus::FAILED,
                'response_code' => 500,
                'response_message' => $e->getMessage(),
                'response_body' => ['exception' => get_class($e), 'trace' => $e->getTraceAsString()],
            ]);

            Log::error("SIAKAD Client Critical Error [{$action}]: " . $e->getMessage(), [
                'request_id' => $requestId,
                'url' => $url,
            ]);

            return [
                'success' => false,
                'status_code' => 500,
                'message' => 'Gagal terhubung ke SIAKAD Bridge: ' . $e->getMessage(),
                'data' => null,
                'request_id' => $requestId,
            ];
        }
    }

    /**
     * Payload sanitizer to avoid leaking sensitive information
     */
    protected function sanitizePayload(array $payload): array
    {
        $sensitiveKeys = ['password', 'secret', 'token', 'access_token', 'authorization'];
        $sanitized = [];

        foreach ($payload as $key => $value) {
            if (in_array(strtolower($key), $sensitiveKeys)) {
                $sanitized[$key] = '********';
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizePayload($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
