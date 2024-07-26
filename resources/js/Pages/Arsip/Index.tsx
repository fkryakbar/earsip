import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import UploadDocument from "./Partials/UploadDocument";
import { Archive, Category } from "@/types";
import { Button, Chip, getKeyValue, Input, Pagination, PaginationItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import Swal from "sweetalert2";
import UpdateDocument from "./Partials/UpdateDocument";
import { FormEvent, FormEventHandler, useState } from "react";
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
export default function Index({ categories, archives, search }: { search: undefined | string, categories: Category[], archives: { current_page: number, data: Archive[], first_page_url: string, from: number, last_page: number, last_page_url: string, links: PaginationLink[], next_page_url: string | null, path: string, per_page: number, prev_page_url: string | null, to: number, total: number } }) {

    const updateModal = useDisclosure();
    const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null)
    const deleteArchive = (fileId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
                try {
                    await deleteArchivePromise(fileId)
                } catch (error) {
                    Swal.showValidationMessage(`
                    Request failed: ${error}
                  `);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if(result.isConfirmed){
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                })
            }
        }).catch(() => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
        })
    }
    function deleteArchivePromise(fileId: string) {
        return new Promise<void>((resolve, reject) => {
            router.delete(route('deleteArchive', { fileId: fileId }), {
                onSuccess: () => {
                    resolve(); // Resolve the promise once the alert is closed
                },
                onError: (error) => {
                    reject(error); // Reject the promise if there is an error
                }
            });
        });
    }

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget)
        const search = form.get('search');
        router.get(route('arsipPage', { search: search }))

    }
    function changePage(page: number) {
        const props: { page: number, search: undefined | string } = {
            page: page,
            search: undefined
        }
        if (search) {
            props.search = search
        }

        router.get(route('arsipPage', props))
    }
    function copyLink(driveLink: string) {
        const textArea = document.createElement("textarea");
        textArea.value = driveLink;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            Toast.fire({
                icon: "success",
                title: "Link berhasil disalin"
            });
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    }
    return <>
        <Head title="Arsip">
            <link href="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.css" rel="stylesheet" />
        </Head>
        <DashboardLayout>
            <div className="lg:w-[60%] w-[95%] mx-auto bg-white p-5 rounded shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-600">Arsip</h1>
                    <UploadDocument categories={categories} />
                    <UpdateDocument categories={categories} archive={selectedArchive} isOpen={updateModal.isOpen} onOpenChange={updateModal.onOpenChange} onClose={updateModal.onClose} />
                </div>
                <div className="flex justify-between mt-6 items-end">
                    <p className="font-semibold text-xs text-gray-500">
                        Menampilkan {archives.per_page > archives.total ? archives.total : archives.per_page} dari {archives.total} arsip
                    </p>
                    <form onSubmit={submit} className="flex items-center max-w-sm">
                        <label htmlFor="simple-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  p-2.5  "
                                placeholder="Cari arsip"
                                name="search"
                                defaultValue={search ? search : ''}
                            />
                        </div>
                        <button
                            type="submit"
                            className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                        >
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                </div>

                <div className="mt-3">
                    <div className=" overflow-x-auto">
                        <Table aria-label="Tabel Arsip" removeWrapper  >
                            <TableHeader>
                                <TableColumn>Judul</TableColumn>
                                <TableColumn>Uploaded By</TableColumn>
                                <TableColumn className="w-[100px] text-center">Kategori</TableColumn>
                                <TableColumn className="w-[100px] text-center">Ukuran</TableColumn>
                                <TableColumn className="text-center">Waktu</TableColumn>
                                <TableColumn className="text-center">Aksi</TableColumn>
                            </TableHeader>
                            <TableBody items={archives.data} emptyContent={"Tidak ada file"}>
                                {(archive) => (
                                    <TableRow key={archive.id}>
                                        <TableCell className="w-[200px]">
                                            <p className="line-clamp-1">
                                                {archive.title}
                                            </p>
                                        </TableCell>
                                        <TableCell>{archive.user.name}</TableCell>
                                        <TableCell className="w-[100px] text-center"><Chip color="success" size="sm">{archive.category.name}</Chip></TableCell>
                                        <TableCell className="w-[100px] text-center">{(archive.size / (1024 ** 2)).toFixed(2)} MB</TableCell>
                                        <TableCell className="text-xs w-[200px] text-center">{formatDate(archive.created_at)}</TableCell>
                                        <TableCell className="flex gap-2 items-center">
                                            <a href={archive.driveLink} target="_blank" className="text-xs bg-blue-500 text-white p-1 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </a>
                                            <button onClick={() => {
                                                updateModal.onOpen();
                                                setSelectedArchive(archive)
                                            }} className="text-xs bg-green-500 text-white p-1 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </button>
                                            <button onClick={() => deleteArchive(archive.fileId)} className="text-xs bg-red-500 text-white p-1 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                            <button onClick={() => copyLink(archive.driveLink)} className="text-xs bg-amber-500 text-white p-1 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                                                </svg>

                                            </button>
                                        </TableCell>

                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Pagination total={archives.links.length - 2} page={archives.current_page} onChange={changePage} showControls isCompact />
                    </div>
                    {/* <PaginationItem /> */}
                </div>
            </div>
        </DashboardLayout>
    </>
}



function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

