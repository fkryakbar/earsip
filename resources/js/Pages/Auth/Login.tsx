import { Head, useForm } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { FormEventHandler } from "react";

export default function Login() {
    const { data, setData, post, errors, processing } = useForm({
        username: '',
        password: '',
    })

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('loginAttempt'))
    }
    return <>
        <Head title="Login Page" />
        <div className="lg:flex h-screen">
            <div className="basis-[30%] flex justify-center items-center h-screen bg-gray-200">
                <div className="bg-white w-[90%] rounded-md p-5 shadow-md">
                    <img src="/assets/ULM.webp" alt="" className="w-[100px] mx-auto" />
                    <h1 className="font-bold text-3xl text-gray-700 text-center mt-3">e-Arsip</h1>
                    <h1 className="font-semibold text-gray-700 text-center">Pendidikan Matematika FKIP ULM</h1>
                    <form onSubmit={onSubmit} className="mt-10">
                        <Input variant="bordered" errorMessage={errors.username} isInvalid={errors.username ? true : false} type="text" label="Username" className="mt-4" onChange={e => setData('username', e.target.value)} disabled={processing} />
                        <Input variant="bordered" errorMessage={errors.password} isInvalid={errors.password ? true : false} type="password" label="Password" className="mt-4" onChange={e => setData('password', e.target.value)} disabled={processing} />
                        <div className="mt-4">
                            <Button type="submit" className="w-full bg-blue-500 text-white font-bold" isLoading={processing} isDisabled={processing}>
                                Login
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="basis-[70%] relative lg:block hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-black bg-opacity-50"></div>
                <img src="/assets/bgulm-min.jpeg" alt="ulm" className="top-0 left-0 h-full w-full object-cover object-center" />
            </div>
        </div>
    </>
}