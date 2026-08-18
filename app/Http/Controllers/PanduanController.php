<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PanduanController extends Controller
{
    /**
     * Display comprehensive interactive user guide for all roles
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Panduan/Index', [
            'currentUserRole' => $user->role?->value ?? $user->role ?? 'asesi',
            'userName' => $user->name,
        ]);
    }
}
