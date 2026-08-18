<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'siakad' => [
        'base_url' => env('SIAKAD_BASE_URL', 'https://bridge.uinssc.ac.id/api'),
        'token' => env('SIAKAD_BEARER_TOKEN', 'ptipd-access-token'),
        'timeout' => (int) env('SIAKAD_TIMEOUT', 30),
        'retry_times' => (int) env('SIAKAD_RETRY_TIMES', 3),
        'retry_sleep' => (int) env('SIAKAD_RETRY_SLEEP_MS', 500),
    ],

    'pddikti' => [
        'base_url' => env('PDDIKTI_BASE_URL', 'https://feeder.kemdikbud.go.id/ws/live.php'),
        'username' => env('PDDIKTI_USERNAME'),
        'password' => env('PDDIKTI_PASSWORD'),
        'token' => env('PDDIKTI_TOKEN'),
        'timeout' => (int) env('PDDIKTI_TIMEOUT', 30),
    ],

];
