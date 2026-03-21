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
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  location: z.string().min(1, { message: "Location is required" }),
  consent: z.boolean().default(false).optional(),
});

export default function WaitlistForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      consent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.consent) {
      toast.error("You must consent to receive emails.");
      return;
    }

    const { error, data } = await actions.waitlist({
      name: values.name,
      email: values.email,
      location: values.location,
      consent: values.consent,
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Where are you currently based?"
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
          disabled={!consent || !isValid}
          className="w-full bg-[#CCCCFF] hover:bg-[#b3b3ff] text-[#2F4858] text-base h-12 font-semibold uppercase shadow-sm transition-transform hover:-translate-y-0.5 focus:-translate-y-0.5"
        >
          JOIN THE WAITLIST
        </Button>
      </form>
    </Form>
  );
}
