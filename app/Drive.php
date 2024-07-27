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
    public function initiateOwnershipTransfer($fileId, $newOwnerEmail)
    {
        $permission = new Permission();
        $permission->setType('user');
        $permission->setRole('writer');
        $permission->setEmailAddress('laravel-drive-arsip@laravel-drive-428422.iam.gserviceaccount.com');
        $permission->setPendingOwner(true);


        $this->service->permissions->create($fileId, $permission);

        $permissions = $this->service->permissions->listPermissions($fileId);
        foreach ($permissions->getPermissions() as $permission) {
            $permissionId = $permission->getId();
            $updatedPermission = new Permission();
            $updatedPermission->setRole('owner');
            // $updatedPermission->setType('user');
            $permission->setEmailAddress($newOwnerEmail);
            try {
                $this->service->permissions->update($fileId, $permissionId, $updatedPermission, [
                    'transferOwnership' => true
                ]);

                echo "Ownership accepted by: " . $newOwnerEmail;
                return;
            } catch (Exception $e) {
                echo 'An error occurred: ' . $e->getMessage();
                return;
            }
        }
    }
    // public function acceptOwnershipTransfer($fileId, $newOwnerEmail)
    // {
    //     $permissions = $this->service->permissions->listPermissions($fileId);
    //     dd($permissions);
    //     foreach ($permissions->getPermissions() as $permission) {
    //         $permissionId = $permission->getId();
    //         $updatedPermission = new Permission();
    //         $updatedPermission->setRole('owner');
    //         $permission->setEmailAddress($newOwnerEmail);
    //         try {
    //             $this->service->permissions->update($fileId, $permissionId, $updatedPermission, [
    //                 'transferOwnership' => true
    //             ]);

    //             echo "Ownership accepted by: " . $newOwnerEmail;
    //             return;
    //         } catch (Exception $e) {
    //             echo 'An error occurred: ' . $e->getMessage();
    //             return;
    //         }
    //     }

    //     echo 'Permission not found for the new owner.';
    // }

    public function transferOwnership($fileId, $newOwnerEmail)
    {
        // Initiate the ownership transfer
        $this->initiateOwnershipTransfer($fileId, $newOwnerEmail);
    }
}
