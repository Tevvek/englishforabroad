# LAYOUT README

There are a few layouts components and it is hard to understand now what is what:

1. Layout.astro: this is the base layout and should no be used
2. DashboardLayout.astro should only be u sed in the dashboard views
3. LandingLayout is only used in the landing page
4. PodcastLayout and TvShowLayout is specifically when in the details view of any of those resources
5. RestLayout is for anything else

\*\* The diff betwen landing and rest layout is just a script that makes the CTA appear after scrolled down after the hero section.
