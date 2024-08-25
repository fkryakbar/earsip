<?php

namespace App\Http\Controllers;

use App\Drive as AppDrive;
use App\Models\User;
use Google\Service\Drive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Auth/Login');
    }

    public function loginAttempt(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ], [
            'username.required' => 'Username wajib diisi',
            'password.required' => 'Password wajib diisi',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('arsip');
        }

        return back()->withErrors([
            'username' => 'Username atau password salah',
        ])->onlyInput('username');
    }

    public function logout(Request $request)
    {

        Auth::logout();
        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function google_redirect()
    {
        return Socialite::driver('google')->scopes([Drive::DRIVE])->redirect();
    }

    public function google_callback(Request $request)
    {
        $auth = Socialite::driver('google')->user();
        session(['token' => $auth->token]);

        if (in_array($auth->email, ['fikriafa289@gmail.com'])) {
            $user = User::where('role', 'admin')->firstOrFail();
            Auth::login($user);

            $request->session()->regenerate();

            return redirect()->intended('arsip');
        }

        return redirect(route('login'))->withErrors([
            'username' => 'Email tidak terdaftar',
        ])->onlyInput('username');
    }
}
