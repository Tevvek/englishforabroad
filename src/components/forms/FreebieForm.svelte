<script lang="ts">
  import { z } from "zod";
  import { actions } from "astro:actions";
  import { toast } from "svelte-sonner";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Label } from "@/components/ui/label";
  import Loader2 from "lucide-svelte/icons/loader-2";

  const freebieFormSchema = z.object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    consent: z.literal(true, {
      errorMap: () => ({ message: "You must consent to receive emails." }),
    }),
  });

  type FreebieFormData = {
    name: string;
    email: string;
    consent: boolean;
  };

  type FreebieFormErrors = Partial<Record<keyof FreebieFormData, string>>;

  let { freebieSlug, buttonText = "Get your guide" } = $props<{ freebieSlug: string; buttonText?: string }>();

  const initialData: FreebieFormData = { name: "", email: "", consent: false };

  let form = $state<FreebieFormData>({ ...initialData });
  let errors = $state<FreebieFormErrors>({});
  let isSubmitting = $state(false);

  function setField<K extends keyof FreebieFormData>(field: K, value: FreebieFormData[K]) {
    form[field] = value;
    errors[field] = undefined;
  }

  function resetForm() {
    form = { ...initialData };
    errors = {};
  }

  function getFieldErrors(error: z.ZodError<FreebieFormData>): FreebieFormErrors {
    const fieldErrors = error.flatten().fieldErrors;

    return {
      name: fieldErrors.name?.[0],
      email: fieldErrors.email?.[0],
      consent: fieldErrors.consent?.[0],
    };
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const result = freebieFormSchema.safeParse(form);

    if (!result.success) {
      errors = getFieldErrors(result.error);
      toast.error(errors.consent ?? "Please correct the highlighted fields.");
      return;
    }

    errors = {};
    isSubmitting = true;

    try {
      const { error, data } = await actions.freebie({
        ...result.data,
        freebieSlug,
      });

      if (error) {
        console.error(error.message);
        toast.error(error.message);
        return;
      }

      const message = data && typeof data === "object" && "message" in data ? String(data.message) : "Success!";
      resetForm();
      toast.success(message);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4 max-w-md mx-auto relative" novalidate>
  <div>
    <Input
      name="name"
      placeholder="Your name"
      bind:value={form.name}
      oninput={() => setField("name", form.name)}
      aria-invalid={errors.name ? "true" : undefined}
      class="h-12 border-0 bg-input text-center shadow-none"
    />
    {#if errors.name}
      <p class="text-destructive text-sm mt-1">{errors.name}</p>
    {/if}
  </div>

  <div>
    <Input
      name="email"
      type="email"
      placeholder="your@email.com"
      bind:value={form.email}
      oninput={() => setField("email", form.email)}
      aria-invalid={errors.email ? "true" : undefined}
      class="h-12 border-0 bg-input text-center shadow-none"
    />
    {#if errors.email}
      <p class="text-destructive text-sm mt-1">{errors.email}</p>
    {/if}
  </div>

  <div>
    <Label class="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
      <Checkbox
        name="consent"
        bind:checked={form.consent}
        onchange={() => setField("consent", form.consent)}
        aria-invalid={errors.consent ? "true" : undefined}
        class="mt-1"
      />
      <span>I agree to receive emails from English for Abroad. I can unsubscribe at any time.</span>
    </Label>
    {#if errors.consent}
      <p class="text-destructive text-sm mt-1">{errors.consent}</p>
    {/if}
  </div>

  <Button
    type="submit"
    disabled={isSubmitting}
    class="h-12 w-full gap-2 text-base uppercase tracking-[0.18em]"
  >
    {#if isSubmitting}
      <Loader2 class="animate-spin" />
      Submitting...
    {:else}
      {buttonText}
    {/if}
  </Button>
</form>
