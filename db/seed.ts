import "dotenv/config";
import { db } from "./index";
import { contentBlocks } from "./schema";

async function main() {
    await db
        .insert(contentBlocks)
        .values([
            // Home page
            { id: "home_hero_title", page: "home", label: "Hero Title" },
            { id: "home_hero_subtitle", page: "home", label: "Hero Subtitle" },
            { id: "home_hero_image", page: "home", label: "Hero Image" },
            { id: "home_about_text", page: "home", label: "About Section Text" },
            // Join page
            // Join page
            { id: "join_inscriptions_list", page: "join", label: "Inscriptions — liste" },
            { id: "join_conditions_list", page: "join", label: "Conditions — liste" },
            { id: "join_rules_left", page: "join", label: "Règles du Multisport — liste" },
            { id: "join_rules_right_doc", page: "join", label: "Règles complètes (PDF)" },
            { id: "join_doc_formulaire", page: "join", label: "Formulaire d'inscription (PDF)" },
            { id: "join_doc_statuts", page: "join", label: "Statuts de l'association (PDF)" }
        ])
        .onConflictDoNothing();

    console.log("Seeded content blocks");
    process.exit(0);
}

main();
