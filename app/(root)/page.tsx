import Image from "next/image";
import Link from "next/link";
import ComiteCard from "../../components/root/ComiteCard";

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* First Section */}
                <div className="flex flex-col md:flex-row items-center justify-between pb-12">
                    <div className="w-full md:w-3/5 h-64 md:h-full">
                    <Image
                        src="/images/multisports.jpg"
                        alt="Multisports"
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                    />
                </div>
                    <div className="w-full md:w-2/5 flex flex-col justify-center px-12 mt-6 md:mt-0">
                        <h1 className="text-4xl font-bold text-center md:text-left">Multisports : la découverte sportive sans routine</h1>
                        <p className="text-lg mt-4 text-center md:text-left">
                            Venez essayer un sport différent toutes les 6 semaines et gardez le plaisir de
                            bouger toute l'année.
                        </p>
                    </div>
            </div>

            {/* Second Section */}
                <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-8 py-16">
                    <div className="w-full md:w-4/5">
                    <h1 className="text-4xl font-bold">Le Concept</h1>
                    <p className="text-lg mt-4 text-justify">
                        Nouveaux sports et défis toutes les 6 semaines etc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nulla vitae fermentum mauris. Integer vel lectus tellus. Mauris ac tempor purus, eu lacinia leo.
                        Cras et nisl sed augue consequat feugiat. Curabitur nec quam id arcu molestie iaculis. Aliquam
                        rutrum mattis rutrum. Suspendisse tempor metus ac velit luctus, ac rutrum eros imperdiet.
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
            {/* Third Section - Le Comité */}
            <div className="px-12 py-16">
                <h1 className="text-4xl font-bold mb-8">Le Comité</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ComiteCard
                        src="/images/comite1.jpg"
                        alt="Baptiste"
                        name="Batptiste"
                        role="Président"
                        description="Description 1"
                    />
                    <ComiteCard
                        src="/images/comite2.jpg"
                        alt="Marc"
                        name="Marc"
                        role="Vice-Président"
                        description="Description 2"
                    />
                    <ComiteCard
                        src="/images/comite3.jpg"
                        alt="Arthur"
                        name="Arthur"
                        role="Trésorier"
                        description="Description 4"
                    />
                    <ComiteCard
                        src="/images/comite4.jpg"
                        alt="David"
                        name="David"
                        role="Secrétaire"
                        description="Description 4"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
