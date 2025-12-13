import {request} from "@/lib/datocms";
import { StructuredText} from "react-datocms";
import {notFound} from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

const QUERY = `query ArticleBySlug($slug: String){
    artikel(filter: {slug: {eq: $slug}}) {
        title
        content{
            value
        }
        _createdAt
        tags
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

    const rawTags = data.artikel.tags;
    const tags = typeof rawTags === 'string'
        ? rawTags.split(',').map((t: string) => t.trim())
        : Array.isArray(rawTags)
            ? rawTags
            : [];

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
            
            <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag: string, index: number) => (
                    <Link
                        key={index}
                        href={`/?search=${encodeURIComponent(tag)}`}
                        className="
                            bg-gray-100 text-gray-600
                            px-3 py-1 rounded-full text-sm font-medium
                            hover:bg-orange-600 hover:text-white
                            transition-all duration-200 cursor-pointer
                            border border-gray-200 hover:border-orange-600
                        "
                    >
                        {tag}
                    </Link>
                ))}
            </div>

            <p className="text-gray-500 mb-8 border-b pb-4">
                Diunggah pada: {new Date(data.artikel._createdAt).toLocaleDateString("id-ID")}
            </p>

            <article className="prose prose-lg prose-orange mx-auto">
                <StructuredText data={data.artikel.content} />
            </article>
        </main>
    );
}