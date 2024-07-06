import { TagsPodcasts } from "@/types/resources";
import { atom } from "nanostores";

export const selectedPodcast = atom<TagsPodcasts>(TagsPodcasts.Business);
