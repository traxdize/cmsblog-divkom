import {request} from "@/lib/datocms";
import Link from "next/link";

export const revalidate = 60;

const QUERY = `query {
  allArtikels{
      id
      title
      slug
      _status
      _createdAt
      date
      tags
      coverImage{
        url
      }
    }
  }`;

  export default async function Home({searchParams}: {searchParams: Promise<{search?: string}> }) {
    const data: any = await request ({
      query: QUERY,
    });

    const {search} = await searchParams;
    let articles = data.allArtikels;

    if (search){
      const keyword = search.toLowerCase(); // ignore kapital
      articles = articles.filter((article: any) => {
        // title check
        const titleMatch = article.title.toLowerCase().includes(keyword);
        // tag check
        const tagsMatch = article.tags
          ? article.tags.toLowerCase().includes(keyword)
          : false;

        return titleMatch || tagsMatch;
      });
    }

return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {search ? `Hasil Pencarian: "${search}"` : "Tulisan Terbaru"}
        </h1>
        {search ? (
          <Link href="/" className="text-orange-600 hover:underline text-sm">
            ← Kembali ke semua artikel
          </Link>
        ) : (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Update seputar kegiatan, teknologi, dan kehidupan di HME ITB.
          </p>
        )}
      </header>

      {articles.length === 0 && (
        <div className="text-center py-20 bg-gray-100 rounded-xl">
          <p className="text-gray-500 text-lg">Tidak ada artikel yang cocok dengan kata kunci <strong>"{search}"</strong>.</p>
          <Link href="/" className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-full text-sm hover:bg-orange-700 transition">
            Lihat Semua Artikel
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article: any) => (
          <Link 
            href={`/blog/${article.slug}`} 
            key={article.id} 
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 relative overflow-hidden bg-gray-200">
              {article.coverImage?.url ? (
                <img
                  src={article.coverImage.url} 
                  alt={article.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
                  <span className="font-bold text-2xl opacity-30">Gambar dimakan Vico</span>
                </div>
              )}
            </div>

            <div className="p-6">
              {article.tags && (
                 <div className="mb-2 flex flex-wrap gap-1">
                   {article.tags.split(',').slice(0, 2).map((t: string, i: number) => (
                     <span key={i} className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                       {t.trim()}
                     </span>
                   ))}
                 </div>
              )}
              
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-gray-400 text-xs">
                {new Date(article.date || article._createdAt).toLocaleDateString("id-ID", {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}