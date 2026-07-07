import SiteChrome from "@/components/SiteChrome";

export default function CivelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome world="civel">{children}</SiteChrome>;
}
