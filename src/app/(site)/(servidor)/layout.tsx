import SiteChrome from "@/components/SiteChrome";

export default function ServidorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome world="servidor">{children}</SiteChrome>;
}
