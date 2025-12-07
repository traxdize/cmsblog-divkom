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
      coverImage{
        url
      }
    }
  }`;

  export default async function Home() {
    const data: any = await request ({
      query: QUERY,
    });


        return(
          <div className="max-w-5xl mx-auto px-6 py-12">
              <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  POST PALING HYPE
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  I do not know what to write here.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols2 lg:grid-cols-3 gap-8">
                {data.allArtikels.map((article:any) => (
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400  to-red-500 flex items-center justify-center text-white">
                          <span className="font-bold text-2xl opacity-30">Gambar dimakan Vico</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wider">
                        Artikel
                      </p>
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