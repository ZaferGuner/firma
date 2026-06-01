"use client";

import type { MediaAssetRow } from "@/lib/supabase/types";

export function MediaPicker({
  name,
  assets,
  defaultValue,
  multiple = false,
}: {
  name: string;
  assets: MediaAssetRow[];
  defaultValue?: string;
  multiple?: boolean;
}) {
  return (
    <select name={name} defaultValue={defaultValue} multiple={multiple} className="border border-[#CCC7BD] px-3 py-2 text-sm">
      {!multiple && <option value="">Seçme</option>}
      {assets.map((asset) => (
        <option key={asset.id} value={asset.id}>
          {asset.file_name}
        </option>
      ))}
    </select>
  );
}
