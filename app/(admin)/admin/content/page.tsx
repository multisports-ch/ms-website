import { db } from "@/db";
import { contentBlocks } from "@/db/schema";
import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

const pages = [
    { id: "home", label: "Accueil" },
    { id: "join", label: "Rejoindre" }
];

export default async function AdminContentPage() {
    const blocks = await db.select().from(contentBlocks).orderBy(contentBlocks.page);
    type ContentBlock = (typeof blocks)[number];

    const blocksByPage = pages.reduce(
        (acc, page) => {
            acc[page.id] = blocks.filter((b) => b.page === page.id);
            return acc;
        },
        {} as Record<string, ContentBlock[]>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Blocs de contenu</h1>

            {pages.map((page) => (
                <div key={page.id} className="mb-10">
                    <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wide mb-4">
                        Page {page.label}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {blocksByPage[page.id]?.map((block) => (
                            <ContentBlockEditor key={block.id} block={block} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
