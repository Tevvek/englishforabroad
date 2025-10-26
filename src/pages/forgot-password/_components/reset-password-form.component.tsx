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
import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from "../_schemas/reset-password.schema";
import { actions, isActionError, isInputError } from "astro:actions";
import { toast } from "sonner";
import { navigate } from "astro:transitions/client";
import { isRedirect } from "@/utils/actions.utils";

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  token: string;
}

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData: ResetPasswordFormData) => {
    // Include the token in the form data
    const { error, data } = await actions.resetPassword({
      ...formData,
      token,
    });

    if (error && isInputError(error)) {
      // Handle input validation errors
      Object.entries(error.fields).forEach(([field, fieldErrors]) => {
        if (fieldErrors && fieldErrors.length > 0) {
          form.setError(field as keyof ResetPasswordFormData, {
            message: fieldErrors[0],
          });
        }
      });
      return;
    }

    if (error && isActionError(error)) {
      toast.error(error.message);
      return;
    }

    if (data && isRedirect(data)) {
      navigate(data.to);
      return;
    }

    toast.error("An unknown error occurred");
    return;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create new password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
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
                  {form.formState.isSubmitting
                    ? "Resetting..."
                    : "Reset Password"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <a href="/login" className="underline">
                    Sign in
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
