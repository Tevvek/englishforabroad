<script lang="ts">
  import { z } from "zod";
  import { actions } from "astro:actions";
  import { toast } from "svelte-sonner";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import Loader2 from "lucide-svelte/icons/loader-2";

  const waitlistFormSchema = z.object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    location: z.string().trim().min(1, { message: "Location is required" }),
    consent: z.literal(true, {
      errorMap: () => ({ message: "You must consent to receive emails." }),
    }),
  });

  type WaitlistFormData = {
    name: string;
    email: string;
    location: string;
    consent: boolean;
  };

  type WaitlistFormErrors = Partial<Record<keyof WaitlistFormData, string>>;

  const initialData: WaitlistFormData = { name: "", email: "", location: "", consent: false };

  let form = $state<WaitlistFormData>({ ...initialData });
  let errors = $state<WaitlistFormErrors>({});
  let isSubmitting = $state(false);

  function setField<K extends keyof WaitlistFormData>(field: K, value: WaitlistFormData[K]) {
    form[field] = value;
    errors[field] = undefined;
  }

  function resetForm() {
    form = { ...initialData };
    errors = {};
  }

  function getFieldErrors(error: z.ZodError<WaitlistFormData>): WaitlistFormErrors {
    const fieldErrors = error.flatten().fieldErrors;

    return {
      name: fieldErrors.name?.[0],
      email: fieldErrors.email?.[0],
      location: fieldErrors.location?.[0],
      consent: fieldErrors.consent?.[0],
    };
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const result = waitlistFormSchema.safeParse(form);

    if (!result.success) {
      errors = getFieldErrors(result.error);
      toast.error(errors.consent ?? "Please correct the highlighted fields.");
      return;
    }

    errors = {};
    isSubmitting = true;

    try {
      const { error, data } = await actions.waitlist(result.data);

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
      class="bg-white h-12 text-center"
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
      class="bg-white h-12 text-center"
    />
    {#if errors.email}
      <p class="text-destructive text-sm mt-1">{errors.email}</p>
    {/if}
  </div>

  <div>
    <Input
      name="location"
      placeholder="Where are you currently based?"
      bind:value={form.location}
      oninput={() => setField("location", form.location)}
      aria-invalid={errors.location ? "true" : undefined}
      class="bg-white h-12 text-center"
    />
    {#if errors.location}
      <p class="text-destructive text-sm mt-1">{errors.location}</p>
    {/if}
  </div>

  <div>
    <label class="text-muted-foreground flex items-start gap-2 text-sm">
      <input
        name="consent"
        type="checkbox"
        bind:checked={form.consent}
        onchange={() => setField("consent", form.consent)}
        aria-invalid={errors.consent ? "true" : undefined}
        class="border-input mt-0.5 size-4 shrink-0 rounded border"
      />
      <span>I agree to receive emails from English for Abroad. I can unsubscribe at any time.</span>
    </label>
    {#if errors.consent}
      <p class="text-destructive text-sm mt-1">{errors.consent}</p>
    {/if}
  </div>

  <Button
    type="submit"
    disabled={isSubmitting}
    class="w-full bg-[#CCCCFF] hover:bg-[#b3b3ff] text-[#2F4858] text-base h-12 font-semibold uppercase shadow-sm transition-transform hover:-translate-y-0.5 focus:-translate-y-0.5"
  >
    {#if isSubmitting}
      <Loader2 class="animate-spin mr-2" />
    {/if}
    JOIN THE WAITLIST
  </Button>
</form>
