import { MarketingHeader } from "@/components/layout/marketing-header";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <MarketingHeader />
      {children}
    </>
  );
}
