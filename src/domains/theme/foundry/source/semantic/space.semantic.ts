/**
 * Space, radius, and aspect-ratio ramps. Rem everywhere.
 */
export interface SizeEntry { readonly name: string; readonly value: string; }

export const spaceRamp: readonly SizeEntry[] = [
  { name: "size-px",  value: "0.0625rem" },
  { name: "size-0",   value: "0rem" },
  { name: "size-1",   value: "0.25rem" },
  { name: "size-1_5", value: "0.375rem" },
  { name: "size-2",   value: "0.5rem" },
  { name: "size-2_5", value: "0.625rem" },
  { name: "size-3",   value: "0.75rem" },
  { name: "size-3_5", value: "0.875rem" },
  { name: "size-4",   value: "1rem" },
  { name: "size-5",   value: "1.25rem" },
  { name: "size-6",   value: "1.5rem" },
  { name: "size-7",   value: "2rem" },
  { name: "size-8",   value: "3rem" },
  { name: "size-9",   value: "4rem" },
  { name: "size-10",  value: "5rem" },
  { name: "size-12",  value: "6rem" },
  { name: "size-14",  value: "7rem" },
  { name: "size-16",  value: "8rem" },
  { name: "size-20",  value: "10rem" },
  { name: "size-24",  value: "12rem" },
];

export const radiusRamp: readonly SizeEntry[] = [
  { name: "radius-sm",     value: "0.375rem" },
  { name: "radius-md",     value: "0.625rem" },
  { name: "radius-lg",     value: "0.875rem" },
  { name: "radius-xl",     value: "1.125rem" },
  { name: "radius-2xl",    value: "1.5rem" },
  { name: "radius-pill",   value: "9999px" },
  { name: "radius-blob-1", value: "63% 37% 54% 46% / 55% 48% 52% 45%" },
  { name: "radius-blob-2", value: "42% 58% 38% 62% / 60% 42% 58% 40%" },
];

export const ratioRamp: readonly SizeEntry[] = [
  { name: "ratio-square",   value: "1 / 1" },
  { name: "ratio-video",    value: "16 / 9" },
  { name: "ratio-cinema",   value: "2.39 / 1" },
  { name: "ratio-portrait", value: "3 / 4" },
  { name: "ratio-golden",   value: "1.618 / 1" },
];
