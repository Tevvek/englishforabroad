import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import { Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  consent: z.boolean().default(false).optional(),
});

interface FreebieFormProps {
  freebieSlug?: string;
  buttonText?: string;
}

export default function FreebieForm({ 
  freebieSlug, 
  buttonText = "Get your guide" 
}: FreebieFormProps = {}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      consent: false,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.consent) {
      toast.error("You must consent to receive emails.");
      return;
    }

    const { error, data } = await actions.freebie({
      name: values.name,
      email: values.email,
      consent: values.consent,
      ...(freebieSlug && { freebieSlug }),
    });

    if (error) {
      console.error(error.message);
      toast.error(error.message);
      return;
    }

    const { message } = data;

    form.reset();
    toast.success(message);
  }

  const consent = useWatch({ control: form.control, name: "consent" });
  const isValid = form.formState.isValid;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto relative"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  className="bg-white h-12 text-center"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  {...field}
                  className="bg-white h-12 text-center"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex items-center text-start text-wrap ">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
              <FormLabel className="text-muted-foreground text-sm">
                I agree to receive emails from English for Abroad. I can
                unsubscribe at any time.
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!consent || !isValid || isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 font-semibold uppercase flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Submitting...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </Form>
  );
}
