<?php

namespace App\Http\Controllers;

use App\Drive;
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

        $client = new Drive();
        $folderId =  $client->createFolder($request->name);

        $request->merge([
            'folderId' => $folderId,
        ]);

        Category::create($request->all());
        return back();
    }

    public function update($id, Request $request)
    {
        $request->validate([
            'name' => ['required', 'unique:App\Models\Category,name,' . $id],
        ]);
        $category = Category::where('id', $id)->firstOrFail();

        $client = new Drive();

        $client->renameFolder($category->folderId, $request->name);

        $category->update($request->all());
        return back();
    }


    public function delete($id)
    {

        $category = Category::where('id', $id)->firstOrFail();
        $client = new Drive();

        $category->delete();
        return back();
    }
}
