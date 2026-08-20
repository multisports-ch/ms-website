import Image from "next/image";
import LinkedText from "@/components/shared/LinkedText";

type Props = {
    src: string;
    alt?: string;
    name: string;
    role: string;
    description?: string;
};

export default function ComiteCard({ src, alt = "Membre", name, role, description }: Props) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden h-72 sm:h-80 flex flex-col">
            <div className="relative h-1/2 w-full">
                <Image src={src} alt={alt} fill className="object-cover" />
            </div>
            <div className="p-4 flex flex-col justify-between h-1/2 bg-secondary">
                <div>
                    <h3 className="text-xl font-semibold text-black">{name}</h3>
                    <p className="text-sm text-black/80"><LinkedText text={role} /></p>
                    {description ? (
                        <p className="mt-2 text-sm text-black/90"><LinkedText text={description} /></p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
