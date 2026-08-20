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
            { id: "join_association_text", page: "join", label: "Présentation de l'association et adhésion" },
            { id: "join_statuts_document", page: "join", label: "Statuts de l'association (PDF)" },
            { id: "join_rules_document", page: "join", label: "Règles du Multisport (PDF)" },
            { id: "join_membership_form", page: "join", label: "Lien du formulaire d'adhésion en ligne" },
            // Email templates
            {
                id: "template_email_guest",
                page: "email",
                label: "Confirmation d'inscription invité",
                text: "Bonjour {{name}},\n\nVotre inscription au {{eventType}} {{eventName}} est confirmée.\n\nDate : {{eventDateTime}}\nLieu : {{eventLocation}}\nPrix invité : {{eventPrice}}\n\nÀ bientôt !"
            },
            {
                id: "template_email_guest_subject",
                page: "email",
                label: "Objet de confirmation d'inscription invité",
                text: "Confirmation d'inscription - {{eventType}} {{eventName}}"
            }
        ])
        .onConflictDoNothing();

    console.log("Seeded content blocks");
    process.exit(0);
}

main();
