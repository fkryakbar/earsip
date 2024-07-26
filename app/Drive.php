<?php

namespace App;

use Exception;
use Google\Client;
use Google\Service\Drive as DriveDrive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;

class Drive
{
    public $client;
    public $service;
    private $folderId;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->useApplicationDefaultCredentials();
        $this->client->addScope(DriveDrive::DRIVE);
        $this->service = new DriveDrive($this->client);
        $this->folderId = env('DRIVE_FOLDER_ID');
    }

    public function uploadFile($filePath, $folderId = null)
    {
        $file = new DriveFile();
        $file->setName(basename($filePath));
        if ($folderId) {
            $file->setParents([$folderId]);
        } else {
            $file->setParents([$this->folderId]);
        }

        $mimeType = mime_content_type($filePath);
        $data = file_get_contents($filePath);

        $createdFile = $this->service->files->create($file, [
            'data' => $data,
            'mimeType' => $mimeType,
            'uploadType' => 'multipart'
        ]);

        return $createdFile->id;
    }

    public function createFolder($folderName)
    {
        $folder = new DriveFile();
        $folder->setName($folderName);
        $folder->setMimeType('application/vnd.google-apps.folder');

        if ($this->folderId) {
            $folder->setParents([$this->folderId]);
        }

        try {
            $createdFolder = $this->service->files->create($folder, [
                'fields' => 'id, name'
            ]);
            return $createdFolder->getId();
        } catch (\Exception $e) {
            return null;
        }
    }

    public function deleteFile($fileId)
    {
        $this->service->files->delete($fileId);
    }


    public function generateShareableLink($fileId)
    {

        $file = $this->service->files->get($fileId, array('fields' => 'webViewLink'));
        return $file->getWebViewLink();
    }
    public function renameFolder($folderId, $newName)
    {
        $folder = new DriveFile();
        $folder->setName($newName);

        try {
            $updatedFolder = $this->service->files->update($folderId, $folder, [
                'fields' => 'id, name'
            ]);

            return $updatedFolder->getId();
        } catch (\Exception $e) {
            return null;
        }
    }
    public function deleteFolder($folderId)
    {
        $this->service->files->delete($folderId);
    }
    public function renameFile($fileId, $newName)
    {
        $file = new DriveFile();
        $file->setName($newName);

        try {
            $updatedFile = $this->service->files->update($fileId, $file);
            return $updatedFile;
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }
}
