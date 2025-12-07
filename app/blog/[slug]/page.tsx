import {request} from "@/lib/datocms";
import { StructuredText} from "react-datocms";
import {notFound} from "next/navigation";

export const revalidate = 30;

const QUERY = `query ArticleBySlug($slug: String){
    artikel(filter: {slug: {eq: $slug}}) {
        title
        content{
            value
        }
        _createdAt
        coverImage {
            url
        }
    }
}`;

export default async function BlogPost({params}: {params: Promise<{slug: string}> }){
    const {slug} = await params; // penting

    const data: any = await request({
        query: QUERY,
        variables: {slug: slug},
    });

    // notfound
    if (!data.artikel){
        return notFound();
    }

    return(
        <main className="max-w-3xl mx-auto p-10">
            {/* Cover Image */}
            {data.artikel.coverImage && (
                <img
                    src={data.artikel.coverImage.url}
                    alt={data.artikel.title} // kalo gak ada
                    className="w-full h-64 object-cover rounded-lg mb-8"
                />
            )}

            <h1 className="text-4xl font-bold mb-4">{data.artikel.title}</h1>

            <p className="text-gray-500 mb-8 border-b pb-4">
                Diunggah pada: {new Date(data.artikel._createdAt).toLocaleDateString("id-ID")}
            </p>

            <article className="prose lg:prose-xl">
                <StructuredText data={data.artikel.content} />
            </article>
        </main>
    );
}