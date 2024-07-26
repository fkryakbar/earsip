import { Link, router, usePage } from "@inertiajs/react";
import { ReactNode, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { url, component } = usePage()
    return <>
        <nav className="bg-white shadow-lg w-full relative z-10">
            <div className={`lg:w-[60%] w-[95%] mx-auto lg:p-4 p-2 lg:flex justify-between transition-all lg:h-fit ${isMenuOpen ? 'h-[280px]' : 'h-[60px]'} overflow-clip`}>
                <div className="flex w-full justify-between items-center">
                    <Link href="/" className="flex gap-4 items-center">
                        <img src="/assets/ULM.webp" className="lg:size-[50px] size-[40px]" alt="ULM" />
                        <div className="text-gray-700">
                            <p className="lg:text-xl text-lg font-bold">e-Arsip</p>
                            <p className="lg:text-sm text-[10px] font-bold">Pendidikan Matematika FKIP ULM</p>
                        </div>
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden block btn btn-sm bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <div className="items-center gap-4 flex flex-col lg:flex-row my-5 lg:my-0">
                    <Link href="/arsip" className={`${url.startsWith('/arsip') ? 'text-blue-500 font-semibold' : ''}`}>Arsip</Link>
                    <Link href="/kategori" className={`${url.startsWith('/kategori') ? 'text-blue-500 font-semibold' : ''}`}>Kategori</Link>
                    {/* <Link href="/config" className={`${url.startsWith('/config') ? 'text-blue-500 font-semibold' : ''}`}>Config</Link> */}
                    <Link href="/logout" className="text-red-500">Logout</Link>
                </div>
            </div>
        </nav>
        <div className="h-[100px] bg-blue-500 -mb-[50px]">

        </div>
        {children}
    </>
}