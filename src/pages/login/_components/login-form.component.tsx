import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../_schemas/login.schema";
import { actions, isActionError, isInputError } from "astro:actions";
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";
import { isRedirect } from "@/utils/actions.utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: LoginFormData) => {
    const { error, data } = await actions.login(formData);

    if (error && isInputError(error)) {
      // Handle input validation errors
      Object.entries(error.fields).forEach(([field, fieldErrors]) => {
        form.setError(field as keyof LoginFormData, {
          message: fieldErrors[0],
        });
      });
      return;
    }

    if (error && isActionError(error)) {
      toast.error(error.message);
      return;
    }

    if (data && isRedirect(data)) {
      // Using window.location.href instead of Astro's navigate() because password managers
      // (specifically Bitwarden) can interfere with view transitions and prevent redirects
      window.location.href = data.to;
      return;
    }

    toast.error("An unknown error occurred");
    return;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline">
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
