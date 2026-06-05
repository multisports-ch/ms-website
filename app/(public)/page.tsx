import Image from "next/image";
import Link from "next/link";
import { getContentBlock, getCommitteeMembers } from "@/lib/queries";
import ComiteCard from "@/components/public/ComiteCard";

export default async function Home() {
    const [heroImage, heroTitle, heroSubtitle, aboutText, members] = await Promise.all([
        getContentBlock("home_hero_image"),
        getContentBlock("home_hero_title"),
        getContentBlock("home_hero_subtitle"),
        getContentBlock("home_about_text"),
        getCommitteeMembers()
    ]);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between pb-12">
                <div className="w-full md:w-3/5 h-64 md:h-full">
                    {heroImage?.imageUrl ? (
                        <Image
                            src={heroImage.imageUrl}
                            alt={heroImage.imageAlt ?? "Multisports"}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src="/images/multisports.jpg"
                            alt="Multisports"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="w-full md:w-2/5 flex flex-col justify-center px-12 mt-6 md:mt-0">
                    <h1 className="text-4xl font-bold text-center md:text-left">
                        {heroTitle?.text ?? "Multisports : la découverte sportive sans routine"}
                    </h1>
                    <p className="text-lg mt-4 text-center md:text-left">
                        {heroSubtitle?.text ??
                            "Venez essayer un sport différent toutes les 6 semaines et gardez le plaisir de bouger toute l'année."}
                    </p>
                </div>
            </div>

            {/* Le Concept Section */}
            <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-8 py-16">
                <div className="w-full md:w-4/5">
                    <h1 className="text-4xl font-bold">Le Concept</h1>
                    <p className="text-lg mt-4 text-justify">
                        {aboutText?.text ?? "Nouveaux sports et défis toutes les 6 semaines..."}
                    </p>
                </div>
                <div className="w-full md:w-1/5 flex justify-center mt-6 md:mt-0">
                    <Link href="/join">
                        <button className="bg-accent text-white px-6 py-3 rounded-3xl font-bold text-xl flex items-center gap-2 group hover:gap-3 transition-all whitespace-nowrap cursor-pointer w-full md:w-auto justify-center">
                            <span className="flex-1 text-center md:text-left">Viens essayer</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Le Comité Section */}
            <div className="px-12 py-16">
                <h1 className="text-4xl font-bold mb-8">Le Comité</h1>
                {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {members.map((member) => (
                            <ComiteCard
                                key={member.id}
                                src={member.photoUrl ?? "/images/placeholder.jpg"}
                                alt={member.name}
                                name={member.name}
                                role={member.role}
                                description={member.description ?? undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Aucun membre du comité pour le moment.</p>
                )}
            </div>
        </div>
    );
}
