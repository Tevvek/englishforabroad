import { login } from "@/pages/login/_actions/login.action";
import { register } from "@/pages/register/_actions/register.action";
import { freebie } from "./freebie";
import { waitlist } from "./waitlist";

export const server = {
  freebie,
  waitlist,
  login,
  register,
};
