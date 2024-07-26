<?php

namespace App\Http\Controllers;

use App\Models\Config;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ConfigController extends Controller
{
    public function index()
    {
        $GOOGLE_DRIVE_REFRESH_TOKEN = env('GOOGLE_DRIVE_REFRESH_TOKEN');
        $GET_REFRESH_TOKEN_LINK = env('GET_REFRESH_TOKEN_LINK');

        $configs = [
            'GOOGLE_DRIVE_REFRESH_TOKEN' => $GOOGLE_DRIVE_REFRESH_TOKEN,
            'GET_REFRESH_TOKEN_LINK' => $GET_REFRESH_TOKEN_LINK
        ];

        return Inertia::render('Config/Index', compact('configs'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'GOOGLE_DRIVE_REFRESH_TOKEN' => 'required',
            'GET_REFRESH_TOKEN_LINK' => 'required'
        ]);

        // $GOOGLE_DRIVE_REFRESH_TOKEN = Config::where('name', 'GOOGLE_DRIVE_REFRESH_TOKEN')->first();
        // $GET_REFRESH_TOKEN_LINK = Config::where('name', 'GET_REFRESH_TOKEN_LINK')->first();

        // $GOOGLE_DRIVE_REFRESH_TOKEN->value = $request->input('GOOGLE_DRIVE_REFRESH_TOKEN');
        // $GET_REFRESH_TOKEN_LINK->value = $request->input('GET_REFRESH_TOKEN_LINK');

        // $GOOGLE_DRIVE_REFRESH_TOKEN->save();
        // $GET_REFRESH_TOKEN_LINK->save();


        $values = [
            'GOOGLE_DRIVE_REFRESH_TOKEN' => $request->GOOGLE_DRIVE_REFRESH_TOKEN,
            'GET_REFRESH_TOKEN_LINK' => '"' . $request->GET_REFRESH_TOKEN_LINK . '"',
        ];
        $envFile = app()->environmentFilePath();
        $str = File::get($envFile);

        foreach ($values as $envKey => $envValue) {
            $str = preg_replace("/^{$envKey}=.*/m", "{$envKey}={$envValue}", $str);
        }

        File::put($envFile, $str);

        return back();
    }
}
