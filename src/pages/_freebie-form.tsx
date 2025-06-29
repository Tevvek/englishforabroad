import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  consent: z.boolean().default(false).optional(),
});

export default function FreebieForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      consent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.consent) {
      alert("You must consent to receive emails.");
      return;
    }

    const { error, data } = await actions.freebie({
      name: values.name,
      email: values.email,
      consent: values.consent,
    });

    if (error) {
      console.error(error.message);
      alert(error.message);
      return;
    }

    const { message } = data;

    alert(message);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
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
          disabled={!form.watch("consent") || !form.formState.isValid}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 font-semibold uppercase"
        >
          Get your guide
        </Button>
      </form>
    </Form>
  );
}
