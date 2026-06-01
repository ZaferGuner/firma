"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import {
  createFolderAction,
  deleteMediaAction,
  updateMediaMetaAction,
  type ActionState,
} from "@/app/actions/media";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";

type MediaLibraryProps = {
  folders: MediaFolderRow[];
  assets: MediaAssetRow[];
  currentFolderId?: string;
};

export function MediaLibrary({ folders, assets, currentFolderId }: MediaLibraryProps) {
  const [folderState, folderAction, creatingFolder] = useActionState<ActionState, FormData>(createFolderAction, {});
  const [metaState, metaAction, savingMeta] = useActionState<ActionState, FormData>(updateMediaMetaAction, {});
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, startDelete] = useTransition();

  const currentFolder = folders.find((folder) => folder.id === currentFolderId);
  const childFolders = folders.filter((folder) =>
    currentFolder ? folder.parent_id === currentFolder.id : folder.parent_id === null,
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-4">
          <ImageUploader folders={folders} currentFolderId={currentFolderId} />
          <form action={folderAction} className="grid gap-3 border border-[#DDD8CE] bg-white p-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Klasör Oluştur</h2>
            {folderState.error && <p className="text-sm text-red-600">{folderState.error}</p>}
            {folderState.message && <p className="text-sm text-green-700">{folderState.message}</p>}
            <input type="hidden" name="parent_id" value={currentFolderId || ""} />
            <input name="name" placeholder="Klasör adı" className="border border-[#CCC7BD] px-3 py-2 text-sm" />
            <button disabled={creatingFolder} className="bg-[#2563EB] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60" type="submit">
              {creatingFolder ? "Oluşturuluyor..." : "Klasör Oluştur"}
            </button>
          </form>
        </div>

        <div className="grid gap-5">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/admin/media" className="font-semibold text-[#2563EB]">Medya Kökü</Link>
            {currentFolder && <span className="text-[#66635E]">/ {currentFolder.full_path}</span>}
          </div>

          {deleteError && <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{deleteError}</div>}
          {metaState.error && <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{metaState.error}</div>}
          {metaState.message && <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{metaState.message}</div>}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {childFolders.map((folder) => (
              <Link key={folder.id} href={`/admin/media?folder=${folder.id}`} className="border border-[#DDD8CE] bg-white p-4 hover:border-[#2563EB]">
                <span className="block text-sm font-bold">{folder.name}</span>
                <span className="mt-2 block text-xs text-[#66635E]">{folder.full_path}</span>
              </Link>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <article key={asset.id} className="grid gap-3 border border-[#DDD8CE] bg-white p-3">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ECE8DF]">
                  <Image src={asset.public_url} alt={asset.alt_text || asset.file_name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="truncate text-sm font-semibold">{asset.file_name}</h3>
                  <p className="mt-1 text-xs text-[#66635E]">{asset.mime_type} · {asset.file_size ? `${Math.round(asset.file_size / 1024)} KB` : "-"}</p>
                </div>
                <form action={metaAction} className="grid gap-2">
                  <input type="hidden" name="id" value={asset.id} />
                  <input name="title" defaultValue={asset.title || ""} placeholder="Başlık" className="border border-[#CCC7BD] px-2 py-2 text-xs" />
                  <input name="alt_text" defaultValue={asset.alt_text || ""} placeholder="Alt text" className="border border-[#CCC7BD] px-2 py-2 text-xs" />
                  <button disabled={savingMeta} type="submit" className="bg-[#2563EB] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-60">Kaydet</button>
                </form>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(asset.public_url)}
                    className="border border-[#CCC7BD] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em]"
                  >
                    URL Kopyala
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      if (!window.confirm("Görsel silinsin mi? Projede kullanılıyorsa işlem durdurulur.")) return;
                      const data = new FormData();
                      data.set("id", asset.id);
                      setDeleteError("");
                      startDelete(async () => {
                        try {
                          await deleteMediaAction(data);
                        } catch (error) {
                          setDeleteError(error instanceof Error ? error.message : "Görsel silinemedi.");
                        }
                      });
                    }}
                    className="border border-red-200 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-red-700 disabled:opacity-60"
                  >
                    Sil
                  </button>
                </div>
              </article>
            ))}
          </div>

          {childFolders.length === 0 && assets.length === 0 && (
            <div className="border border-dashed border-[#CCC7BD] bg-white px-5 py-12 text-center text-sm text-[#66635E]">
              Bu klasörde henüz medya yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
