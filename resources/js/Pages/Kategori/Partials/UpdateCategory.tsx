import { Archive, Category } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Checkbox, Select, SelectItem, Progress, Button } from "@nextui-org/react";
import { progress } from "framer-motion";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";

export default function UpdateDocument({ category, isOpen, onOpenChange, onClose }: { category: Category | null, isOpen: boolean, onOpenChange: () => void, onClose: () => void }) {
    const [curretCategory, setCurrentCategory] = useState(category)
    const { setData, data, processing, patch, errors, progress, reset, recentlySuccessful } = useForm({
        name: curretCategory?.name,
    })
    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        patch(route('updateKategori', {
            id: curretCategory?.id
        }))
    }
    useEffect(() => {
        setCurrentCategory(category);
        setData({
            name: category?.name,
        });

    }, [category])
    return <>
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Update Kategori</ModalHeader>
                        <ModalBody>
                            {
                                recentlySuccessful ? (<>
                                    <div className="bg-green-200 text-green-700 font-semibold p-4 rounded-md flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>
                                        Kategori Berhasil diperbarui
                                    </div>
                                </>) : null
                            }
                            <form onSubmit={submit}>
                                <Input type="Nama Dokumen" value={data?.name} onChange={e => setData('name', e.target.value)} variant={'bordered'} label="Kategori" labelPlacement="outside" placeholder="Masukkan Judul" size="lg" errorMessage={errors.name} isInvalid={errors.name ? true : false} />

                                <div className="flex justify-end my-5">
                                    <Button type="submit" color="primary" disabled={processing} isLoading={processing}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        Perbarui
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>

                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}