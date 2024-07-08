/* eslint-disable arrow-body-style */
import DocumentSection from "@/components/shared/DocumentSection";
import MainLayout from "@/components/layout/MainLayout";

const TermsAndConditionsPage = () => {
  return (
    <MainLayout
      title="Terms and Conditions - KHYN HQ"
      className="flex flex-col max-w-screen-xl px-6 sm:px-16 mx-auto pb-20"
    >
      <h1 className="font-bold text-display-md pt-10">Terms and Conditons</h1>
      <p className="pt-4 font-semibold text-sm">Last updated: July 2024</p>

      <DocumentSection
        heading="1. Introduction"
        desc="Welcome to KHYN HQ. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, you may not access the website or use our services."
      />
      <DocumentSection
        heading="2. Use of Website"
        desc="You are responsible for ensuring that all information you provide is accurate, current, and complete. You may not use our website for any unlawful or unauthorized purpose."
      />
      <DocumentSection
        heading="3. Intellectual Property"
        desc="The content, design, logos, trademarks, and other intellectual property displayed on our website are owned by or licensed to us. You may not use, reproduce, modify, distribute, or display any part of our website or its content without our prior written consent."
      />
      <DocumentSection
        heading="4. User Content"
        desc="You may submit content, such as comments or feedback, to our website. By submitting content, you grant us a non-exclusive, worldwide, royalty-free, perpetual, and irrevocable right to use, reproduce, modify, adapt, publish, translate, distribute, and display such content."
      />
      <DocumentSection
        heading="5. Limitation of Liability"
        desc="We strive to provide accurate and up-to-date information on our website, but we do not warrant the completeness, accuracy, or reliability of any content. Your use of our website is at your own risk. We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of our website."
      />
      <DocumentSection
        heading="6. Changes to Terms and Conditions"
        desc="We reserve the right to update or modify these Terms and Conditions at any time without prior notice. We will notify you of any changes by posting the updated Terms and Conditions on this page. Your continued use of our website after any changes constitutes acceptance of the updated Terms and Conditions."
      />
    </MainLayout>
  );
};

export default TermsAndConditionsPage;
