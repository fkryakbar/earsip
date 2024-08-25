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
        // $this->client->useApplicationDefaultCredentials();
        $this->client->setAccessToken(session('token'));
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
    public function moveFile($fileId, $newFolderId)
    {
        try {

            $file = $this->service->files->get($fileId, ['fields' => 'parents']);
            $previousParents = join(',', $file->parents);

            $updatedFile = $this->service->files->update($fileId, new DriveFile(), [
                'addParents' => $newFolderId,
                'removeParents' => $previousParents,
                'fields' => 'id, parents'
            ]);

            return $updatedFile->getId();
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }

    public function getStorageDetails()
    {
        try {
            $about = $this->service->about->get(['fields' => 'storageQuota']);
            $storageQuota = $about->getStorageQuota();

            $totalStorage = $storageQuota['limit']; // Total storage limit
            $usedStorage = $storageQuota['usage']; // Total storage used

            return [
                'total_storage' => $totalStorage / (1024 ** 3),
                'used_storage' => $usedStorage / (1024 ** 3),
                'remaining_storage' => ($totalStorage - $usedStorage) / (1024 ** 3)
            ];
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }

    public function editPermission($fileId, $permissionType = 'reader')
    {

        $permission = new Permission();

        if ($permissionType === 'private') {
            $permissions = $this->service->permissions->listPermissions($fileId);
            foreach ($permissions->getPermissions() as $perm) {
                if ($perm->getType() === 'anyone') {
                    $this->service->permissions->delete($fileId, $perm->getId());
                }
            }
            return true;
        }

        $role = $permissionType === 'writer' ? 'writer' : 'reader';
        $permission->setRole($role);
        $permission->setType('anyone');

        try {
            $this->service->permissions->create($fileId, $permission);
            return true;
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return false;
        }
    }




    public  function listFilesAndFolders($folderId = null)
    {
        $folderId = $folderId ?: $this->folderId;

        try {
            $parameters = [
                'q' => "'{$folderId}' in parents and trashed=false",
                'fields' => 'files(id, name, mimeType)'
            ];
            $files = $this->service->files->listFiles($parameters);
            $items = [];

            foreach ($files as $file) {
                $items[] = [
                    'id' => $file->getId(),
                    'name' => $file->getName(),
                    'mime_type' => $file->getMimeType()
                ];
            }

            return $items;
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }
}
