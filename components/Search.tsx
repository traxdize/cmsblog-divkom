"use client"

import { useRouter, useSearchParams} from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchInput(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const currentSearch = searchParams.get("search");
        if (currentSearch) {
            setQuery(currentSearch);
        }
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // redirect homepage
        if (query.trim()) {
            router.push(`/?search=${encodeURIComponent(query)}`);
        } else {
            router.push("/");
        }
    };

    return(
        <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
                type="text"
                placeholder="Cari artikel atau post.."
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-120 transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600"
            >
                🔍
            </button>
        </form>
    );
}