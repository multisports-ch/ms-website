import { db } from "@/db";
import { contentBlocks } from "@/db/schema";
import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

const pages = [
    { id: "home", label: "Accueil" },
    { id: "join", label: "Rejoindre" },
    { id: "email", label: "Emails" }
];

const editableJoinBlocks = new Set([
    "join_title",
    "join_subtitle",
    "join_association_title",
    "join_association_text",
    "join_rules_title",
    "join_rules_text",
    "join_membership_title",
    "join_membership_text",
    "join_statuts_label",
    "join_statuts_document",
    "join_rules_label",
    "join_rules_document",
    "join_membership_form",
    "join_membership_form_label"
]);

export default async function AdminContentPage() {
    const blocks = await db.select().from(contentBlocks).orderBy(contentBlocks.page);
    type ContentBlock = (typeof blocks)[number];

    const blocksByPage = pages.reduce(
        (acc, page) => {
            acc[page.id] = blocks.filter(
                (b) => b.page === page.id && (page.id !== "join" || editableJoinBlocks.has(b.id))
            );
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
