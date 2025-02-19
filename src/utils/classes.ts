import { twMerge } from "tailwind-merge";

function classes(...classes: any[]): string {
  return twMerge(classes);
}

export default classes;
