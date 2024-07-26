import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Archive, Category } from "@/types";
import { Button, Chip, getKeyValue, Input, Pagination, PaginationItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import Swal from "sweetalert2";
import { FormEvent, FormEventHandler, useState } from "react";
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
export default function Index({ configs }: { configs: { GOOGLE_DRIVE_REFRESH_TOKEN: string | undefined, GET_REFRESH_TOKEN_LINK: string | undefined } }) {
    const [isVisible, setIsVisible] = useState(false);
    const { data, post, recentlySuccessful, setData, errors, processing } = useForm({
        GOOGLE_DRIVE_REFRESH_TOKEN: configs.GOOGLE_DRIVE_REFRESH_TOKEN,
        GET_REFRESH_TOKEN_LINK: configs.GET_REFRESH_TOKEN_LINK
    });
    const toggleVisibility = () => setIsVisible(!isVisible);

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('updateConfig'))

    }

    return <>
        <Head title="Arsip" />
        <DashboardLayout>
            <div className="lg:w-[60%] w-[95%] mx-auto bg-white p-5 rounded shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-600">Config </h1>
                    <a target="_blank" href={configs.GET_REFRESH_TOKEN_LINK} className="p-2 bg-green-500 rounded text-white font-semibold text-xs">
                        Get Refresh Token
                    </a>
                </div>
                <div className="mt-3">
                    {
                        recentlySuccessful ? (<>
                            <div className="bg-green-200 text-green-700 font-semibold p-4 rounded-md flex items-center gap-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                                Config Berhasil diperbarui
                            </div>
                        </>) : null
                    }
                    <form onSubmit={submit}>
                        <Input
                            isDisabled={processing}
                            label="GOOGLE_DRIVE_REFRESH_TOKEN"
                            variant="bordered"
                            placeholder="Enter your password"
                            value={data.GOOGLE_DRIVE_REFRESH_TOKEN}
                            onChange={e => setData('GOOGLE_DRIVE_REFRESH_TOKEN', e.target.value)}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        </>
                                    ) : (
                                        <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                        </>
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                        />
                        <Input
                            isDisabled={processing}
                            label="GET_REFRESH_TOKEN_LINK"
                            variant="bordered"
                            placeholder="Enter your password"
                            value={data.GET_REFRESH_TOKEN_LINK}
                            onChange={e => setData('GET_REFRESH_TOKEN_LINK', e.target.value)}
                            className="mt-3"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        </>
                                    ) : (
                                        <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                        </>
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" className="mt-3" color="primary" isLoading={processing}>Simpan </Button>
                        </div>
                    </form>
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

