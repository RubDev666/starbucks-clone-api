export type LinkAccordion = {
    href: string;
    title: string; 
}

export type MainCategory = {
    name: string;
    slug: string;
    types: {
        slug: string;
        title: string;
        image: string;
    }[];
}

export type SubCategory = {
    title: string;
    categories: {
        title: string;
        products: {
            id: string;
            name: string;
            imageSmall: string;
        }[];
    }[];
}

export type FetchMainCategories = {
    success: boolean;
    data: MainCategory[];
}

export type FetchSubCategories = Pick<FetchMainCategories, 'success'> & {
    data: SubCategory;
}
