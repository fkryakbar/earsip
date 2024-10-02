import { Category } from "@/types";
import { useForm } from "@inertiajs/react";
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, Select, SelectItem, Textarea, useDisclosure } from "@nextui-org/react";
import { FormEventHandler } from "react";

export default function UploadDocument({ categories }: { categories: Category[] }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { setData, data, processing, post, errors, progress, reset, recentlySuccessful } = useForm<{ title: string, description: string, category_id: string, file: any, visibility: string }>({
        title: '',
        description: '',
        category_id: '',
        visibility: '',
        file: '',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('upload'), {
            onSuccess: () => {
                reset('category_id', 'title', 'description', 'file')
            }
        })

    }
    return <>
        <div className="flex items-center gap-2">
            <Button variant="bordered" onPress={() => { window.location.href = "https://drive.google.com/drive/folders/1NiUmTwaVd91rJ-FepeDBsDFk7qF9wc_9" }}>
                <img src="/assets/google-drive.png" alt="" className="w-[25px]" />
            </Button>
            <Button onPress={onOpen} className="bg-blue-500 text-white font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Tambah
            </Button>
        </div>
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Tambah Dokumen</ModalHeader>
                        <ModalBody>
                            {
                                recentlySuccessful ? (<>
                                    <div className="bg-green-200 text-green-700 font-semibold p-4 rounded-md flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                        </svg>
                                        Dokumen Berhasil diupload
                                    </div>
                                </>) : null
                            }
                            <form onSubmit={submit}>
                                <Input type="Judul Dokumen" value={data.title} onChange={e => setData('title', e.target.value)} variant={'bordered'} label="Judul" labelPlacement="outside" placeholder="Masukkan Judul" size="lg" errorMessage={errors.title} isInvalid={errors.title ? true : false} />
                                <label htmlFor="message" className={`block mb-2 text-sm text-gray-900 mt-[20px] ${errors.description ? 'text-red-500' : ''}`}>Deksripsi Dokumen</label>
                                <textarea id="message" value={data.description} onChange={e => setData('description', e.target.value)} rows={4} className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-black focus:border-black ${errors.description ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500  focus:border-red-500' : ''}`} placeholder="Masukkan deskripsi Dokumen untuk mempermudah pencarian" disabled={processing}></textarea>
                                <p className="mb-[40px] text-sm text-red-600 dark:text-red-500">{errors.description}</p>

                                <Select
                                    items={categories}
                                    label="Ketegori"
                                    placeholder="Pilih Kategori"
                                    variant="bordered"
                                    className="max-w-xs mb-[40px]"
                                    labelPlacement="outside"
                                    onChange={e => setData('category_id', e.target.value)}
                                    isDisabled={processing}
                                    errorMessage={errors.category_id} isInvalid={errors.category_id ? true : false}
                                    value={data.category_id}
                                >
                                    {(category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>}
                                </Select>
                                <Select
                                    items={categories}
                                    label="Visibility"
                                    placeholder="Pilih Visibility"
                                    variant="bordered"
                                    className="max-w-xs"
                                    labelPlacement="outside"
                                    onChange={e => setData('visibility', e.target.value)}
                                    isDisabled={processing}
                                    errorMessage={errors.visibility} isInvalid={errors.visibility ? true : false}
                                    value={data.visibility}
                                >
                                    <SelectItem key={'public'} value={'public'}>Public</SelectItem>
                                    <SelectItem key={'private'} value={'private'}>Private</SelectItem>
                                </Select>

                                <label className={`block mb-2 text-sm text-gray-900 mt-[20px] ${errors.file ? 'text-red-500' : ''}`} htmlFor="file_input">Upload file</label>
                                <input onChange={e => setData('file', e.target.files?.[0])} className={`block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none ${errors.file ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500  focus:border-red-500' : ''}`} id="file_input" type="file" disabled={processing} />
                                <p className="text-sm text-red-600 dark:text-red-500">{errors.file}</p>
                                {
                                    processing ? (<>
                                        <Progress aria-label="Loading..." value={progress?.percentage} className="mt-5" />
                                        {
                                            progress?.percentage == 100 ? (<>
                                                <p className="text-sm text-gray-500 mt-2 font-semibold">Mengunggah ke Google Drive</p>
                                            </>) : (<>
                                                <p className="text-sm text-gray-500 mt-2 font-semibold">Mengunggah ke Server</p>
                                            </>)
                                        }
                                    </>) : null
                                }
                                <div className="flex justify-end my-5">
                                    <Button type="submit" color="primary" disabled={processing} isLoading={processing}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        Upload
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