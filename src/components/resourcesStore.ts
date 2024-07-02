import { TagsPodcasts, type Podcast } from "@/types/resources";
import { computed, reactive, ref } from "vue";

const podcasts = ref<Podcast[]>([]);
const podcastsTag = ref<TagsPodcasts>(TagsPodcasts.English);

function setPodcasts(newPodcasts: Podcast[]) {
  podcasts.value = newPodcasts;
}

const filteredPodcasts = computed(() => {
  return podcasts.value.filter((podcast) => podcast.tag === podcastsTag.value);
});

export { podcasts, setPodcasts, filteredPodcasts, podcastsTag };
