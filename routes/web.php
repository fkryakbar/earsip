<?php

use App\Drive;
use App\Http\Controllers\ArsipController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\KategoriController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

if (env('APP_ENV') === 'production') {
    URL::forceScheme('https');
}

Route::get('/', [AuthController::class, 'loginPage'])->name('login');
Route::post('/', [AuthController::class, 'loginAttempt'])->name('loginAttempt');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');


Route::group(['middleware' => 'auth'], function () {
    Route::get('/arsip', [ArsipController::class, 'index'])->name('arsipPage');
    Route::post('/arsip', [ArsipController::class, 'upload'])->name('upload');
    Route::patch('/arsip/{fileId}', [ArsipController::class, 'update'])->name('updateArchive');
    Route::delete('/arsip/{fileId}', [ArsipController::class, 'delete'])->name('deleteArchive');

    Route::get('/kategori', [KategoriController::class, 'index'])->name('kategoriPage');
    Route::post('/kategori', [KategoriController::class, 'create'])->name('createKategori');
    Route::patch('/kategori/{id}', [KategoriController::class, 'update'])->name('updateKategori');
    Route::delete('/kategori/{id}', [KategoriController::class, 'delete'])->name('deleteKategori');

    // Route::get('/config', [ConfigController::class, 'index'])->name('configPage');
    // Route::post('/config', [ConfigController::class, 'update'])->name('updateConfig');


    Route::get('qouta', function () {
        $client = new Drive();

        $data = $client->getStorageDetails();
        dd($data);
    });
});
