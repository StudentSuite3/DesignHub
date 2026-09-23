"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBrandStore } from "@/store/brand-store";

export function BrandIdentityFields() {
  const profile = useBrandStore((state) => state.profile);
  const updateProfile = useBrandStore((state) => state.updateProfile);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brand-name">Brand name</Label>
        <Input
          id="brand-name"
          value={profile.name}
          maxLength={60}
          onChange={(event) => updateProfile({ name: event.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brand-description">Description</Label>
        <Textarea
          id="brand-description"
          value={profile.description}
          maxLength={240}
          onChange={(event) => updateProfile({ description: event.target.value })}
          className="min-h-16"
        />
      </div>
    </div>
  );
}
