"use client";

import { useTransition } from "react";
import { deleteProjectAction } from "@/app/actions/projects";

export function DeleteProjectButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Proje silinsin mi? Bu işlem geri alınamaz.")) return;
        const data = new FormData();
        data.set("id", id);
        startTransition(() => {
          void deleteProjectAction(data);
        });
      }}
      className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700 disabled:opacity-60"
    >
      Sil
    </button>
  );
}
