import { getJoinPageContent } from "@/lib/queries";

function DownloadButton({ url, label }: { url: string | null | undefined; label: string }) {
    if (!url) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors group"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
            </svg>
            {label}
        </a>
    );
}

function TextList({ text, fallback }: { text?: string | null; fallback: string[] }) {
    const lines = text ? text.split("\n").filter((l) => l.trim()) : fallback;

    return (
        <ul className="flex flex-col gap-2">
            {lines.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--primary)" }}
                    />
                    {line.replace(/^[-•]\s*/, "")}
                </li>
            ))}
        </ul>
    );
}

export default async function JoinPage() {
    const content = await getJoinPageContent();

    return (
        <div className="px-6 md:px-12 py-16">
            {/* Header */}
            <div className="mb-12">
                <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--accent)" }} />
                <h1 className="text-5xl font-black tracking-tight text-foreground">Participer</h1>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left column */}
                <div className="flex flex-col gap-10">
                    {/* Inscriptions et Invitations */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-black text-foreground">Inscriptions et Invitations</h2>
                        <TextList
                            text={content["join_inscriptions_list"]?.text}
                            fallback={[
                                "Télécharger le formulaire d'inscription (membres etc.)",
                                "Demande de crédits d'invités (explications et conditions de participation à définir ici)",
                                "Statuts"
                            ]}
                        />
                        <div className="flex flex-wrap gap-2 mt-1">
                            <DownloadButton
                                url={content["join_doc_formulaire"]?.fileUrl}
                                label="Formulaire d'inscription"
                            />
                            <DownloadButton url={content["join_doc_statuts"]?.fileUrl} label="Statuts" />
                        </div>
                    </section>

                    {/* Conditions de participation */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-black text-foreground">Conditions de participation</h2>
                        <TextList
                            text={content["join_conditions_list"]?.text}
                            fallback={[
                                "Multisport se déroule dans le respect etc.",
                                "Implication dans l'association",
                                "Coûts"
                            ]}
                        />
                    </section>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-black text-foreground">Règles du Multisport</h2>
                    <TextList
                        text={content["join_rules_left"]?.text}
                        fallback={[
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                            "Nulla vitae fermentum mauris.",
                            "Integer vel lectus tellus.",
                            "Mauris ac tempor purus, eu lacinia leo.",
                            "Cras et nisl sed augue consequat feugiat.",
                            "Curabitur nec quam id arcu molestie iaculis.",
                            "Aliquam rutrum mattis rutrum.",
                            "Suspendisse tempor metus ac velit luctus.",
                            "Mauris fringilla faucibus metus."
                        ]}
                    />
                    <div className="mt-2">
                        <DownloadButton
                            url={content["join_rules_right_doc"]?.fileUrl}
                            label="Télécharger les règles complètes"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
