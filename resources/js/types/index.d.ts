export interface User {
    id: number;
    name: string;
    username: string;
    role: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};


export interface Category {
    id: number;
    name: string;
}

export interface Archive {
    id: number,
    user: User,
    title: string,
    description: string,
    category: Category,
    category_id: number | string,
    original_filename: string,
    extension: string,
    size: number,
    fileId:string,
    folderId:string,
    driveLink: string,
    created_at: string,
    updated_at: string,

}