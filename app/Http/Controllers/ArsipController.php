<?php

namespace App\Http\Controllers;

use App\Drive;
use App\Models\Archive;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Yaza\LaravelGoogleDriveStorage\Gdrive;

class ArsipController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::all();
        $archives = Archive::with('user', 'category')->paginate();
        $search = null;
        if ($request->search) {
            $search = $request->search;
            $archives = Archive::where(function ($query) use ($search) {
                $query->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            })->with('user', 'category')->paginate();
        }
        // dd($archives);
        return Inertia::render('Arsip/Index', compact('categories', 'archives', 'search'));
    }

    public function upload(Request $request)
    {
        $request->validate([
            'title' => 'nullable|min:3',
            'category_id' => 'required|numeric',
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx|max:2048',
            'visibility' => 'required',
        ]);
        // if ($request->sameWithTitle) {
        //     $request->merge([
        //         'title' => $request->file('file')->getClientOriginalName()
        //     ]);
        // } else {
        //     if ($request->title == null) {
        //         throw ValidationException::withMessages([
        //             'title' => 'Title field is required'
        //         ]);
        //     }
        // }
        $category = Category::where('id', $request->category_id)->firstOrFail();
        $drive = new Drive();

        if ($request->title) {
            $storedPath = $request->file('file')->storeAs('temporary', $request->title);
        } else {
            $storedPath = $request->file('file')->storeAs('temporary', $request->file('file')->getClientOriginalName());
            $request->merge([
                'title' => $request->file('file')->getClientOriginalName()
            ]);
        }

        $path = Storage::path($storedPath);
        $fileId = $drive->uploadFile($path, $category->folderId);

        Storage::delete($storedPath);

        $driveLink = $drive->generateShareableLink($fileId);

        if ($request->visibility == 'public') {
            $drive->editPermission($fileId, 'reader');
        } else {
            $drive->editPermission($fileId, 'private');
        }

        $request->mergeIfMissing([
            'fileId' => $fileId,
            'user_id' => Auth::user()->id,
            'original_filename' => $request->file('file')->getClientOriginalName(),
            'extension' => $request->file('file')->getClientOriginalExtension(),
            'size' => $request->file('file')->getSize(),
            'folderId' => env('DRIVE_FOLDER_ID'),
            'driveLink' => $driveLink

        ]);

        Archive::create($request->except(['file', 'sameWithTitle']));

        return back();
    }


    public function delete($fileId)
    {

        $archive = Archive::where('fileId', $fileId)->where('user_id', Auth::user()->id)->firstOrFail();

        $client = new Drive();

        $client->deleteFile($fileId);

        $archive->delete();


        return back();
    }

    public function update($fileId, Request $request)
    {
        $request->validate([
            'title' => 'required|min:3',
            'description' => 'nullable|min:3',
            'category_id' => 'required|numeric',
            'visibility' => 'required',
        ]);

        $archive = Archive::where('fileId', $fileId)->where('user_id', Auth::user()->id)->firstOrFail();
        $category = Category::where('id', $request->category_id)->firstOrFail();

        $client = new Drive();
        $client->renameFile($fileId, $request->title);
        $client->moveFile($fileId, $category->folderId);

        if ($request->visibility == 'public') {
            $client->editPermission($fileId, 'reader');
        } else {
            $client->editPermission($fileId, 'private');
        }

        $archive->update($request->all());


        return back();
    }
}
