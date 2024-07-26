import { Archive, Category } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Checkbox, Select, SelectItem, Progress, Button } from "@nextui-org/react";
import { progress } from "framer-motion";
import { FormEventHandler, useEffect, useState } from "react";

export default function UpdateDocument({ archive, categories, isOpen, onOpenChange, onClose }: { categories: Category[], archive: Archive | null, isOpen: boolean, onOpenChange: () => void, onClose: () => void }) {
    const [currentArchive, setCurrentArchive] = useState(archive)
    const { setData, data, processing, patch, errors, progress, reset, recentlySuccessful } = useForm({
        title: currentArchive?.title,
        description: currentArchive?.description,
        category_id: currentArchive?.category_id,
    })
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('updateArchive', {
            fileId: currentArchive?.fileId
        }))


    }
    useEffect(() => {
        setCurrentArchive(archive);
        setData({
            title: archive?.title,
            description: archive?.description,
            category_id: archive?.category_id,
        });

    }, [archive])


    return <>
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Update Dokumen</ModalHeader>
                        <ModalBody>
                            {
                                recentlySuccessful ? (<>
                                    <div className="bg-green-200 text-green-700 font-semibold p-4 rounded-md flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>
                                        Dokumen Berhasil diperbarui
                                    </div>
                                </>) : null
                            }
                            <form onSubmit={submit}>
                                <Input type="Judul Dokumen" value={data?.title} onChange={e => setData('title', e.target.value)} variant={'bordered'} label="Judul" labelPlacement="outside" placeholder="Masukkan Judul" size="lg" errorMessage={errors.title} isInvalid={errors.title ? true : false} />
                                <label htmlFor="message" className={`block mb-2 text-sm text-gray-900 mt-[20px] ${errors.description ? 'text-red-500' : ''}`}>Deksripsi Dokumen</label>
                                <textarea id="message" value={data?.description? data?.description : '' } onChange={e => setData('description', e.target.value)} rows={4} className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-black focus:border-black ${errors.description ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500  focus:border-red-500' : ''}`} placeholder="Masukkan deskripsi Dokumen untuk mempermudah pencarian" disabled={processing}></textarea>
                                <p className="mb-[20px] text-sm text-red-600 dark:text-red-500">{errors.description}</p>
                                <div className="flex flex-col gap-2 justify-center items-center w-[200px] p-4 rounded border-[1px] border-slate-300 mb-10 text-slate-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                    <Button className="w-fit" color="primary" size="sm" onPress={() => window.location.href = currentArchive?.driveLink as string}>Buka</Button>
                                </div>
                                <Select
                                    items={categories}
                                    label="Ketegori"
                                    placeholder="Pilih Kategori"
                                    variant="bordered"
                                    className="max-w-xs"
                                    labelPlacement="outside"
                                    onChange={e => setData('category_id', e.target.value)}
                                    isDisabled={processing}
                                    errorMessage={errors.category_id} isInvalid={errors.category_id ? true : false}
                                    value={data?.category_id}
                                    selectedKeys={[data?.category_id?.toString() as string]}

                                >
                                    {(category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>}
                                </Select>
                                <div className="my-10"></div>
    
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