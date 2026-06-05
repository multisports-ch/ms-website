import "dotenv/config";
import { db } from "./index";
import { contentBlocks } from "./schema";

async function main() {
    await db
        .insert(contentBlocks)
        .values([
            // Home page
            { id: "home_hero_title", page: "home", label: "Hero Title" },
            { id: 'home_hero_subtitle', page: 'home', label: 'Hero Subtitle' },
            { id: "home_hero_image", page: "home", label: "Hero Image" },
            { id: "home_about_text", page: "home", label: "About Section Text" },
            { id: "home_about_image", page: "home", label: "About Section Image" },

            // Calendar page
            { id: "calendar_intro_text", page: "calendar", label: "Calendar Intro Text" },

            // Join page
            { id: "join_intro_text", page: "join", label: "Join Page Intro Text" },
            { id: "join_instructions", page: "join", label: "Join Instructions" },

            // Contact page
            { id: "contact_intro_text", page: "contact", label: "Contact Page Intro Text" }
        ])
        .onConflictDoNothing();

    console.log("Seeded content blocks");
    process.exit(0);
}

main();
