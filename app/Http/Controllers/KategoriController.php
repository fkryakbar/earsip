<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Yaza\LaravelGoogleDriveStorage\Gdrive;

class KategoriController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return Inertia::render('Kategori/Index', compact('categories'));
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => ['required', 'unique:App\Models\Category,name'],
        ]);
        Category::create($request->all());
        return back();
    }

    // public function update($id, Request $request)
    // {
    //     $request->validate([
    //         'name' => ['required', 'unique:App\Models\Category,name,' . $id],
    //     ]);
    //     $category = Category::where('id', $id)->firstOrFail();
    //     dd(Storage::disk('google')->move('hello/[KYM5MNXYEYF]R.jpeg', 'Sertifikat/[KYM5MNXYEYF]R.jpeg'));
    //     Gdrive::renameDir($category->name, $request->name);
    //     $category->update($request->all());
    //     return back();
    // }


    public function delete($id)
    {

        $category = Category::where('id', $id)->firstOrFail();
        Gdrive::deleteDir($category->name);
        $category->delete();
        return back();
    }
}
