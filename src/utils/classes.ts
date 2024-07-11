// This is useful to use in components that use media breakpoints and their Tailwind classes become too long
// Not useful for conditionals or overrides, if that is the case then use tailwind-merge
function classes(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default classes;
