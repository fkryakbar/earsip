import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import { Archive, Category } from "@/types";
import { Button, Chip, getKeyValue, Input, Pagination, PaginationItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import Swal from "sweetalert2";
import { FormEvent, FormEventHandler, useState } from "react";
import UpdateCategory from "./Partials/UpdateCategory";
import CreateCategory from "./Partials/CreateCategory";
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
export default function Index({ categories }: { categories: Category[] }) {

    const updateModal = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const deleteCategory = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this! All files related to this category will be deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
                try {
                    await deleteCategoryPromise(id)
                } catch (error) {
                    Swal.showValidationMessage(`
                    Request failed: ${error}
                  `);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your category has been deleted.",
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
    function deleteCategoryPromise(id: number) {
        return new Promise<void>((resolve, reject) => {
            router.delete(route('deleteKategori', { id: id }), {
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

    return <>
        <Head title="Arsip">
            <link href="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.css" rel="stylesheet" />
        </Head>
        <DashboardLayout>
            <div className="lg:w-[60%] w-[95%] mx-auto bg-white p-5 rounded shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-600">Kategori</h1>
                    <UpdateCategory category={selectedCategory} isOpen={updateModal.isOpen} onOpenChange={updateModal.onOpenChange} onClose={updateModal.onClose} />
                    <CreateCategory />
                </div>
                <div className="mt-3">
                    <Table aria-label="Tabel Arsip" removeWrapper  >
                        <TableHeader>
                            <TableColumn>Name</TableColumn>
                            <TableColumn className="text-center">Aksi</TableColumn>
                        </TableHeader>
                        <TableBody items={categories} emptyContent={"Tidak ada file"}>
                            {(category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <p className="line-clamp-1">
                                            {category.name}
                                        </p>
                                    </TableCell>
                                    <TableCell className="flex gap-2 items-center justify-center">
                                        <button onClick={() => {
                                            updateModal.onOpen();
                                            setSelectedCategory(category)
                                        }} className="text-xs bg-green-500 text-white p-1 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button onClick={() => deleteCategory(category.id)} className="text-xs bg-red-500 text-white p-1 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </TableCell>

                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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

