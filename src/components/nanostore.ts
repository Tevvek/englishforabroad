import { PodcastsThemes } from "@/types/resources";
import { atom } from "nanostores";

export const selectedPodcast = atom<PodcastsThemes>(PodcastsThemes.Art);
