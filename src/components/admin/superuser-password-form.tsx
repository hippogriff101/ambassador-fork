"use client";

import { useRef, type FormEvent } from "react";

import { ConfirmSubmitForm } from "@/components/admin/confirm-submit-form";
import { buttonVariants } from "@/components/ui/button";

type SuperuserPasswordFormProps = {
  action: string;
  buttonLabel: string;
  confirmationMessage: string;
  disabled: boolean;
  passwordPrompt: string;
  redirectTo: string;
  variant?: "default" | "success";
};

export function SuperuserPasswordForm({
  action,
  buttonLabel,
  confirmationMessage,
  disabled,
  passwordPrompt,
  redirectTo,
  variant = "default",
}: SuperuserPasswordFormProps) {
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    const password = window.prompt(passwordPrompt);

    if (password === null || password === "") {
      event.preventDefault();
      return;
    }

    if (passwordInputRef.current !== null) {
      passwordInputRef.current.value = password;
    }
  }

  return (
    <ConfirmSubmitForm
      action={action}
      method="POST"
      className="max-w-xl"
      confirmationMessage={confirmationMessage}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <input ref={passwordInputRef} type="hidden" name="superuserPassword" />
      <button disabled={disabled} className={buttonVariants({ variant, size: "app" })}>
        {buttonLabel}
      </button>
    </ConfirmSubmitForm>
  );
}
