import { resolveSlot } from "@/lib/images";
import { SlotView } from "./SlotView";

type Props = {
  id: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
};

/**
 * The only way pictures get onto the site (server components).
 * Looks up `id` in content/images.json. See the README: to use a real photo, save
 * the file at the path in the manifest and set its status to "final".
 */
export function ImageSlot({ id, ...rest }: Props) {
  return <SlotView slot={resolveSlot(id)} {...rest} />;
}
