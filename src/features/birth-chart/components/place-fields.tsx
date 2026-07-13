"use client";

import { LocateFixed, MapPin } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { searchPlaces, type Place } from "../places";
import type { BirthChartFormValues } from "../schema";
import { FieldError } from "./field-error";

const COMMON_TIMEZONES = ["Asia/Thimphu", "Asia/Kathmandu", "Asia/Kolkata", "Asia/Dhaka", "UTC"];

export function PlaceFields() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BirthChartFormValues>();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [geoStatus, setGeoStatus] = useState<"idle" | "locating" | "denied">("idle");
  const listId = useId();
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const query = watch("placeName") ?? "";
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const timezone = watch("timezone");
  const suggestions = open ? searchPlaces(query) : [];

  function selectPlace(place: Place) {
    setValue("placeName", `${place.name}, ${place.region}`, { shouldValidate: true });
    setValue("latitude", place.latitude, { shouldValidate: true });
    setValue("longitude", place.longitude, { shouldValidate: true });
    setValue("timezone", place.timezone, { shouldValidate: true });
    setOpen(false);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return setGeoStatus("denied");
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("placeName", "My current location", { shouldValidate: true });
        setValue("latitude", Number(position.coords.latitude.toFixed(4)), { shouldValidate: true });
        setValue("longitude", Number(position.coords.longitude.toFixed(4)), { shouldValidate: true });
        setValue("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone, { shouldValidate: true });
        setGeoStatus("idle");
      },
      () => setGeoStatus("denied"),
      { timeout: 8000 },
    );
  }

  const placeRegistration = register("placeName");

  return (
    <div className="grid gap-3">
      <div className="relative grid gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="placeName">Place of birth</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={useCurrentLocation}
            disabled={geoStatus === "locating"}
            className="h-7 gap-1.5 text-xs"
          >
            <LocateFixed className="size-3.5" aria-hidden="true" />
            {geoStatus === "locating" ? "Locating…" : "Current location"}
          </Button>
        </div>

        <Input
          id="placeName"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Start typing — e.g. Thimphu, Paro, Punakha"
          {...placeRegistration}
          onChange={(event) => {
            placeRegistration.onChange(event);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={(event) => {
            placeRegistration.onBlur(event);
            // Delay so an option click lands before the list unmounts.
            blurTimeout.current = setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={(event) => {
            if (!suggestions.length) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlighted((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlighted((i) => Math.max(i - 1, 0));
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              const pick = suggestions[highlighted];
              if (pick) selectPlace(pick);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />

        {open && suggestions.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-md border border-input bg-popover shadow-xl shadow-black/40"
          >
            {suggestions.map((place, i) => (
              <li key={`${place.name}-${place.region}`} role="option" aria-selected={i === highlighted}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => {
                    if (blurTimeout.current) clearTimeout(blurTimeout.current);
                    selectPlace(place);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                    i === highlighted ? "bg-accent/15 text-foreground" : "text-foreground/85"
                  }`}
                >
                  <span>{place.name}</span>
                  <span className="text-xs text-muted-foreground">{place.region}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <FieldError message={errors.placeName?.message} />
        {geoStatus === "denied" && (
          <p className="text-xs text-muted-foreground">
            Location unavailable — pick a place from the list or use Advanced below.
          </p>
        )}
        {latitude !== undefined && longitude !== undefined && timezone && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3 text-gold" aria-hidden="true" />
            Using {latitude.toFixed(2)}°, {longitude.toFixed(2)}° · {timezone}
          </p>
        )}
      </div>

      <details className="group">
        <summary className="cursor-pointer text-xs text-muted-foreground select-none hover:text-foreground">
          [+] Advanced — set coordinates &amp; timezone manually
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="latitude" className="text-xs text-muted-foreground">
              Latitude
            </Label>
            <Input id="latitude" type="number" step="any" placeholder="27.47" {...register("latitude")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="longitude" className="text-xs text-muted-foreground">
              Longitude
            </Label>
            <Input id="longitude" type="number" step="any" placeholder="89.64" {...register("longitude")} />
          </div>
          <div className="col-span-2 grid gap-1.5">
            <Label htmlFor="timezone" className="text-xs text-muted-foreground">
              Timezone (IANA)
            </Label>
            <Input id="timezone" list="tz-suggestions" placeholder="Asia/Thimphu" {...register("timezone")} />
            <datalist id="tz-suggestions">
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz} />
              ))}
            </datalist>
          </div>
        </div>
      </details>
    </div>
  );
}
