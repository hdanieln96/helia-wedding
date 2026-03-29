import sql from "@/lib/db";
import type { ServicePackage, PackageFeature, ServiceAddon, BookingStep, FAQ } from "@/types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import ServicesClient from "@/components/services-client";

export const metadata = {
  title: "Services | Helia Wedding",
  description: "Discover our wedding photography and videography packages.",
};

export default async function ServicesPage() {
  const [packages, features, addons, steps, faqs, philosophy, headerImg] = await Promise.all([
    sql`SELECT * FROM service_packages WHERE is_active = true ORDER BY sort_order`,
    sql`SELECT * FROM package_features ORDER BY sort_order`,
    sql`SELECT * FROM service_addons WHERE is_active = true ORDER BY sort_order`,
    sql`SELECT * FROM booking_steps ORDER BY sort_order`,
    sql`SELECT * FROM faqs WHERE is_active = true ORDER BY sort_order`,
    sql`SELECT * FROM site_content WHERE section = 'services_philosophy'`,
    sql`SELECT value FROM site_settings WHERE key = 'image_header_services'`,
  ]);

  const packagesWithFeatures = (packages as ServicePackage[]).map((pkg) => ({
    ...pkg,
    features: (features as PackageFeature[]).filter((f) => f.package_id === pkg.id),
  }));

  return (
    <>
      <Navbar />
      <PageHeader
        title="Our Services"
        subtitle="Discover our comprehensive packages for your special day."
        imageUrl={headerImg[0]?.value || undefined}
      />
      <ServicesClient
        packages={packagesWithFeatures}
        addons={addons as ServiceAddon[]}
        steps={steps as BookingStep[]}
        faqs={faqs as FAQ[]}
        philosophy={(philosophy[0] as unknown as import("@/types").SiteContent) || null}
      />
      <Footer />
    </>
  );
}
