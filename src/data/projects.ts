import coincontrol from "@assets/projects/coincontrol.png";
import kanban from "@assets/projects/kanban.png";
import landing from "@assets/projects/landing.png";
import twitchChatBot from "@assets/projects/twitch-chat-bot.png";
import type { ImageMetadata } from "astro";

type Project = {
   id: string;
   title: string;
   description: string;
   demo?: string;
   github: string;
   tags: string[];
   thumbnail: ImageMetadata;
};

export const projects: Project[] = [
   {
      id: "coin-control",
      title: "CoinControl",
      description:
         "CoinControl to aplikacja do śledzenia budżetu zaprojektowana, aby pomóc użytkownikom monitorować ich dochody i wydatki.",
      demo: "https://coincontrol.maciej-garncarski.pl",
      github: "https://github.com/MaciejGarncarski/coin-control",
      tags: ["React", "Tailwind CSS", "Zustand", "Express", "BullMQ", "Prisma"],
      thumbnail: coincontrol,
   },
   {
      id: "kanban",
      title: "Kanban",
      description:
         "Aplikacja Kanban stworzona w NestJS z zastosowaniem wzorców CQRS, Domain-Driven Design (DDD) oraz architektury hexagonalnej.",
      demo: "https://kanban.maciej-garncarski.pl",
      github: "https://github.com/MaciejGarncarski/kanban",
      tags: ["Next.js", "NestJS", "Drizzle ORM", "Mantine UI", "JWT"],
      thumbnail: kanban,
   },
   {
      id: "twitch-chat-bot",
      title: "Twitch Chat Bot",
      description:
         "Bot na platformę Twitch, którego głównym zadaniem jest obsługa systemu song request. Projekt charakteryzuje się modułową budową, co umożliwia bezproblemowe implementowanie kolejnych funkcjonalności.",
      github: "https://github.com/MaciejGarncarski/twitch-chat-bot",
      demo: "https://bot.maciej-garncarski.pl/",
      tags: ["Bun", "Elysia", "React", "WebSocket"],
      thumbnail: twitchChatBot,
   },
   {
      id: "professional-landing-nextjs",
      title: "Professional Landing Page",
      description:
         "Profesjonalna strona docelowa dla firmy, zaprojektowana w celu skutecznego prezentowania usług i przyciągania klientów.",
      demo: "https://professional-landing-nextjs.vercel.app/",
      github: "https://github.com/MaciejGarncarski/professional-landing-nextjs",
      tags: ["Next.js", "Tailwind CSS", "Motion"],
      thumbnail: landing,
   },
] as const;
