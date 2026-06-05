import { db } from "@/db";
import { contentBlocks } from "@/db/schema";
import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

const pages = ["home", "calendar", "join", "contact"];

export default async function AdminContentPage() {
    const blocks = await db.select().from(contentBlocks).orderBy(contentBlocks.page);

    const blocksByPage = pages.reduce(
        (acc, page) => {
            acc[page] = blocks.filter((b) => b.page === page);
            return acc;
        },
        {} as Record<string, typeof blocks>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Content Blocks</h1>

            {pages.map((page) => (
                <div key={page} className="mb-10">
                    <h2 className="text-lg font-semibold text-gray-600 uppercase tracking-wide mb-4">
                        {page} page
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {blocksByPage[page]?.map((block) => (
                            <ContentBlockEditor key={block.id} block={block} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
