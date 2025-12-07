import {request} from "@/lib/datocms";
import Link from "next/link";

export const revalidate = 60;

const QUERY = `query {
  allArtikels{
    id
    title
    slug
    _status
    _firstPublishedAt
    }
  }`;

  export default async function Home() {
    const data: any = await request ({
      query: QUERY,
    });

    return (
      <main className="p-10">
          <h1 className="text-3xl font-bold mb-6">Blog HME ITB</h1>
          <div className="grid gap-4">
            {data.allArtikels.map((article: any) => (
              <Link
                href={`/blog/${article.slug}`}
                key={article.id}
                className="block border p-4 rounded shadow hover:bg-gray-50 transition"
              >
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-gray-500 text-sm">{article._createdAt}</p>
              </Link>
            ))}
          </div>
        </main> 
    );
  }