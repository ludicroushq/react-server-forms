import { source } from "@/app/docs";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source);
