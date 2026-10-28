import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  ListIcon,
  XIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CopyIcon,
  InstagramLogoIcon,
  PlusIcon,
} from "@phosphor-icons/react/ssr";
import type { IconProps } from "@phosphor-icons/react";
const icons = {
  arrow: ArrowRightIcon,
  external: ArrowUpRightIcon,
  pin: MapPinIcon,
  phone: PhoneIcon,
  email: EnvelopeSimpleIcon,
  menu: ListIcon,
  close: XIcon,
  left: CaretLeftIcon,
  right: CaretRightIcon,
  copy: CopyIcon,
  instagram: InstagramLogoIcon,
  plus: PlusIcon,
};
export type IconName = keyof typeof icons;
export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  const Glyph = icons[name];
  return <Glyph size={20} weight="regular" aria-hidden="true" {...props} />;
}
