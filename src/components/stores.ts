import { reactive } from "vue";

export enum TagsPodcasts {
  English = "English Language",
  News = "News & Current Events",
  Stories = "Stories & Literature",
  SelfHelp = "Self Help & Psychology",
  Art = "Art & Design",
  Business = "Business & Tech",
}

export const tagsStore = reactive({
  podcasts: TagsPodcasts.English,
  //   tvShows: "",
});
