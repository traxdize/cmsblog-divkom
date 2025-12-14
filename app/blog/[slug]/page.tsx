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

    allArtikels(orderBy: _createdAt_DESC, first:20, filter: {slug: {neq: $slug}}){
        id
        title
        slug
        tags
        _createdAt
        coverImage{url}
    }
}`;

const normalizeTags = (tags:any): string[] => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim());
    return [];
};

const getRelatedArtikels = (currentTags: string[], allArtikels: any[]) => {
    if (!currentTags.length) return [];

    const scoredArtikels = allArtikels.map((artikel) => {
        const artikelTags = normalizeTags(artikel.tags);

        const intersection = artikelTags.filter(tag => currentTags.includes(tag));

        return{
            ...artikel,
            matchScore: intersection.length,
        };
    });

    return scoredArtikels
        .filter(art => art.matchScore > 0)
        .sort((a,b) => b.matchScore - a.matchScore)
        .slice(0, 3);
};

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

    const currentTags = normalizeTags(data.artikel.tags);

    const relatedArtikels = getRelatedArtikels(currentTags, data.allArtikels);

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
                {currentTags.map((tag: string, index: number) => (
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

            {relatedArtikels.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-10 mt-10">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                        Rekomendasi Artikel
                    </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArtikels.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <div className="aspect-video relative overflow-hidden rounded-lg mb-3 bg-gray-100 dark:bg-gray-800">
                                {post.coverImage ? (
                                    <img
                                        src={post.coverImage.url}
                                        alt={post.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                                        <span className="font-bold text-2xl opacity-30">Vico stop makan gambar pls</span>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {post.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(post._createdAt).toLocaleDateString("id-ID")}
                            </p>
                        </Link>
                    ))}
                </div>
                </div>
            )}
        </main>
    );
}