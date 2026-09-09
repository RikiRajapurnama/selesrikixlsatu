import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { waLink } from "@/lib/utils";
import Navbar from "@/components/customer/Navbar";
import Hero from "@/components/customer/Hero";
import { SalesCard, FloatingWhatsApp } from "@/components/customer/SalesCard";
import Benefits from "@/components/customer/Benefits";
import PromoSection from "@/components/customer/PromoSection";
import PackagesSection from "@/components/customer/Packages";
import OneTimePayments from "@/components/customer/OneTimePayments";
import WhyChooseUs from "@/components/customer/WhyChooseUs";
import HowToOrder from "@/components/customer/HowToOrder";
import RegistrationForm from "@/components/customer/RegistrationForm";
import ServiceAreas from "@/components/customer/ServiceAreas";
import CTA from "@/components/customer/CTA";
import Footer from "@/components/customer/Footer";

export const revalidate = 0;

export default async function Home() {
  const { settings, banner, promos, packages, benefits, areas } =
    await getSiteData();

  return (
    <>
      <Navbar
        websiteName={settings.websiteName}
        whatsappNumber={settings.whatsappNumber}
      />

      <Hero banner={banner} whatsappNumber={settings.whatsappNumber} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="-mt-16 sm:-mt-20">
          <SalesCard
            salesName={settings.salesName}
            salesPhone={settings.salesPhone}
            salesDesc={settings.salesDesc}
            salesPhoto={settings.salesPhoto}
          />
        </div>
      </div>

      <Benefits benefits={benefits} />

      <PromoSection promos={promos} />

      <PackagesSection
        packages={packages}
        whatsappNumber={settings.whatsappNumber}
      />

      <OneTimePayments
        packages={packages}
        whatsappNumber={settings.whatsappNumber}
      />

      <WhyChooseUs benefits={benefits} />

      <HowToOrder />

      <RegistrationForm packages={packages} />

      <ServiceAreas areas={areas} whatsappNumber={settings.whatsappNumber} />

      <CTA salesName={settings.salesName} salesPhone={settings.salesPhone} />

      <Footer
        websiteName={settings.websiteName}
        footerText={settings.footerText}
        whatsappNumber={settings.whatsappNumber}
        salesName={settings.salesName}
        salesPhone={settings.salesPhone}
        instagram={settings.instagram}
        facebook={settings.facebook}
      />

      <FloatingWhatsApp phone={settings.whatsappNumber} />
    </>
  );
}