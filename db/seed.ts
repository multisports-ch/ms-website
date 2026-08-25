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
            { id: "join_title", page: "join", label: "Titre de la page", text: "Rejoindre Multisports" },
            { id: "join_subtitle", page: "join", label: "Sous-titre de la page", text: "Découvrez le prochain sport et défi de la saison." },
            { id: "join_association_title", page: "join", label: "Titre de la présentation", text: "L'association" },
            {
                id: "join_association_text",
                page: "join",
                label: "Présentation de l'association et adhésion",
                text: "Multisports permet de découvrir régulièrement de nouveaux sports dans une ambiance conviviale. Pour devenir membre, consultez les documents officiels, prenez connaissance des règles et remplissez le formulaire en ligne. Les frais et les conditions de participation sont précisés dans les informations de l'association et ses statuts."
            },
            { id: "join_rules_title", page: "join", label: "Titre des règles et frais", text: "Règles et frais" },
            {
                id: "join_rules_text",
                page: "join",
                label: "Texte des règles et frais",
                text: "La participation aux activités se fait dans le respect des règles de l'association. Les frais de membre et les éventuels frais liés aux activités sont indiqués dans les documents officiels."
            },
            { id: "join_membership_title", page: "join", label: "Titre de l'adhésion", text: "Devenir membre" },
            {
                id: "join_membership_text",
                page: "join",
                label: "Texte de l'adhésion",
                text: "Lisez les documents officiels, puis remplissez le formulaire en ligne."
            },
            { id: "join_statuts_label", page: "join", label: "Libellé du téléchargement des statuts", text: "Télécharger les statuts" },
            { id: "join_statuts_document", page: "join", label: "Statuts de l'association (PDF)" },
            { id: "join_rules_label", page: "join", label: "Libellé du téléchargement des règles", text: "Télécharger les règles" },
            { id: "join_rules_document", page: "join", label: "Règles du Multisport (PDF)" },
            { id: "join_membership_form", page: "join", label: "Lien du formulaire d'adhésion en ligne" },
            {
                id: "join_membership_form_label",
                page: "join",
                label: "Libellé du formulaire d'adhésion",
                text: "Remplir le formulaire pour devenir membre"
            },
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
