import { login } from "@/pages/login/_actions/login.action";
import { register } from "@/pages/register/_actions/register.action";
import { forgotPassword } from "@/pages/forgot-password/_actions/forgot-password.action";
import { resetPassword } from "@/pages/forgot-password/_actions/reset-password.action";
import { bookClass } from "@/pages/dashboard/book-class/_actions/book-class.action";
import { freebie } from "./freebie";
import { waitlist } from "./waitlist";

export const server = {
  freebie,
  waitlist,
  login,
  register,
  forgotPassword,
  resetPassword,
  bookClass,
};
