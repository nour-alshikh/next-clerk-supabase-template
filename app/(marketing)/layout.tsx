import { MarketingHeader } from "@/components/layout/marketing-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <MarketingHeader />
      {children}
    </>
  );
}
