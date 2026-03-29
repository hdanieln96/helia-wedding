import sql from "@/lib/db";
import ServicesAdmin from "@/components/admin/services-admin";

export default async function AdminServicesPage() {
  const [packages, features, addons, steps] = await Promise.all([
    sql`SELECT * FROM service_packages ORDER BY sort_order`,
    sql`SELECT * FROM package_features ORDER BY sort_order`,
    sql`SELECT * FROM service_addons ORDER BY sort_order`,
    sql`SELECT * FROM booking_steps ORDER BY sort_order`,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
      <p className="text-sm text-gray-500 mt-1">Manage packages, add-ons, and booking process.</p>
      <ServicesAdmin
        packages={packages as any}
        features={features as any}
        addons={addons as any}
        steps={steps as any}
      />
    </div>
  );
}
