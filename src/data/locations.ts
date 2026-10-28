export type LocationId = "broadway-7918" | "broadway-2127" | "fifth-street";
export type ActiveLocationId = Exclude<LocationId, "fifth-street">;
type BaseLocation = {
  id: LocationId;
  slug: LocationId;
  name: string;
  address: {
    street: string;
    city: "Tyler";
    region: "TX";
    postalCode: string;
    country: "US";
  };
  timezone: "America/Chicago";
  hours: null;
  menuReferences: string[];
  socialLinks: string[];
  imageIds: string[];
  verifiedAt: string | null;
};
export type ActiveLocation = BaseLocation & {
  id: ActiveLocationId;
  status: "open";
  phone: string;
  phoneHref: string;
};
export type ComingLocation = BaseLocation & {
  id: "fifth-street";
  status: "coming_soon";
  phone: null;
  phoneHref: null;
};
export type Location = ActiveLocation | ComingLocation;

export const locations: Location[] = [
  {
    id: "broadway-7918",
    slug: "broadway-7918",
    name: "7918 S. Broadway",
    address: {
      street: "7918 S. Broadway Ave.",
      city: "Tyler",
      region: "TX",
      postalCode: "75703",
      country: "US",
    },
    status: "open",
    phone: "903-630-2661",
    phoneHref: "tel:+19036302661",
    timezone: "America/Chicago",
    hours: null,
    menuReferences: [],
    socialLinks: ["https://www.instagram.com/aztecurbanmxtyler/"],
    imageIds: [],
    verifiedAt: null,
  },
  {
    id: "broadway-2127",
    slug: "broadway-2127",
    name: "2127 S. Broadway",
    address: {
      street: "2127 S. Broadway Ave.",
      city: "Tyler",
      region: "TX",
      postalCode: "75701",
      country: "US",
    },
    status: "open",
    phone: "903-266-9005",
    phoneHref: "tel:+19032669005",
    timezone: "America/Chicago",
    hours: null,
    menuReferences: [],
    socialLinks: ["https://www.instagram.com/aztecurban2127/"],
    imageIds: [],
    verifiedAt: null,
  },
  {
    id: "fifth-street",
    slug: "fifth-street",
    name: "5th Street",
    address: {
      street: "1125 E. 5th Street",
      city: "Tyler",
      region: "TX",
      postalCode: "75701",
      country: "US",
    },
    status: "coming_soon",
    phone: null,
    phoneHref: null,
    timezone: "America/Chicago",
    hours: null,
    menuReferences: [],
    socialLinks: ["https://www.instagram.com/aztecurbanmx/"],
    imageIds: [],
    verifiedAt: null,
  },
];
export const activeLocations = locations.filter(
  (location): location is ActiveLocation => location.status === "open",
);
export const comingLocation = locations.find(
  (location): location is ComingLocation => location.status === "coming_soon",
)!;
export function fullAddress(location: Location): string {
  const a = location.address;
  return `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
}
export function directionsUrl(location: Location): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(location))}`;
}
export function isActiveLocationId(value: unknown): value is ActiveLocationId {
  return activeLocations.some((location) => location.id === value);
}
