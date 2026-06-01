"use client";

import { useActionState } from "react";
import { uploadMediaAction, type ActionState } from "@/app/actions/media";
import type { MediaFolderRow } from "@/lib/supabase/types";

export function ImageUploader({ folders, currentFolderId }: { folders: MediaFolderRow[]; currentFolderId?: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(uploadMediaAction, {});

  return (
    <form action={formAction} className="grid gap-3 border border-[#DDD8CE] bg-white p-4" encType="multipart/form-data">
      <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Görsel Yükle</h2>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-green-700">{state.message}</p>}
      <select name="folder_id" defaultValue={currentFolderId || ""} className="border border-[#CCC7BD] px-3 py-2 text-sm">
        <option value="">General</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.full_path}
          </option>
        ))}
      </select>
      <input name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="border border-[#CCC7BD] px-3 py-2 text-sm" />
      <input name="alt_text" placeholder="Alt text" className="border border-[#CCC7BD] px-3 py-2 text-sm" />
      <button type="submit" disabled={isPending} className="bg-[#2563EB] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60">
        {isPending ? "Yükleniyor..." : "Yükle"}
      </button>
    </form>
  );
}
