/* eslint-disable arrow-body-style */
import DocumentSection from "@/components/shared/DocumentSection";
import MainLayout from "@/components/layout/MainLayout";

const PrivacyPolicyPage = () => {
  return (
    <MainLayout
      title="Privacy Policy - KHYN HQ"
      className="flex flex-col max-w-screen-xl px-6 sm:px-16 mx-auto pb-20"
    >
      <h1 className="font-bold text-display-md pt-10">Privacy Policy</h1>
      <p className="pt-4 font-semibold text-sm">Last updated: July 2024</p>

      <DocumentSection
        heading="1. Introduction"
        desc="Welcome to the KHYN HQ website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully to understand our practices regarding your personal data and how we will treat it."
      />
      <DocumentSection
        heading="2. Information We Collect"
        desc="We collect personal information when you register on our website, submit forms, or interact with us through our communication channels. This may include your name, email address, phone number, and any other information you provide to us. Additionally, we gather usage data, such as pages visited, time spent on each page, links clicked, and other actions taken. We may also collect device and browser information, such as IP address, browser type, language preference, and referring URL."
      />
      <DocumentSection
        heading="3. Use of Information"
        desc="We use the information we collect to provide and maintain our services, respond to your inquiries, and fulfill your requests."
      />
      <DocumentSection
        heading="4. Sharing of Information"
        desc="We may share your information with third-party service providers who assist us in operating our website, conducting our operations, or providing services on our behalf. These service providers are contractually obligated to use your information only as necessary to provide the services we request. We may also disclose your information if required by law or in response to lawful requests by public authorities."
      />
      <DocumentSection
        heading="5. Security of Your Information"
        desc="We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, disclosure, alteration, or destruction. However, while we strive to protect your data, no method of transmission over the Internet or electronic storage is entirely secure."
      />
      <DocumentSection
        heading="6. Use of Cookies and Similar Technologies"
        desc={`Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyze trends, administer the website, track users' movements around the site, and gather demographic information. You can control the use of cookies through your browser settings.`}
      />
      <DocumentSection
        heading="7. Third-Party Links"
        desc="Our website may contain links to third-party websites or services that are not operated or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services."
      />
      <DocumentSection
        heading="8. Changes to This Privacy Policy"
        desc="We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any changes by posting the updated Privacy Policy on this page. Please review this Privacy Policy periodically for any updates."
      />
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
