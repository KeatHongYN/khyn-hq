import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/components/layout/MainLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/shared/Accordion";
import useTextWithAnchors from "@/lib/hooks";
import { KHYN_IG_URL, KEI_LOK_GITHUB_URL } from "@/lib/config";
import { FAQ_DATA } from "@/lib/data";

const OneFAQContent = ({ content }) => {
  const formattedContent = useTextWithAnchors(content, {
    [KHYN_IG_URL]: "Keat Hong Youth Network",
    [KEI_LOK_GITHUB_URL]: "Kei Lok"
  });
  return formattedContent;
};

const AccordionSection = ({
  heading,
  contents,
  className,
  selectedAccordion,
  setSelectedAccordion
}) => (
  <div className={className}>
    <h2 className="text-display-xs font-bold">{heading}</h2>
    {contents.map((oneFaq, index) => (
      <AccordionItem
        onClick={() => {
          if (oneFaq.id === selectedAccordion) {
            setSelectedAccordion(null);
          } else {
            setSelectedAccordion(oneFaq.id);
          }
        }}
        id={oneFaq.id}
        key={index}
        value={oneFaq.id}
        className="scroll-mt-[80px]"
      >
        <AccordionTrigger className="text-left">{oneFaq.qns}</AccordionTrigger>
        <AccordionContent>
          <OneFAQContent content={oneFaq.ans} />
        </AccordionContent>
      </AccordionItem>
    ))}
  </div>
);

const FAQ = () => {
  const [urlFragment, setUrlFragment] = useState(null);
  const [selectedAccordion, setSelectedAccordion] = useState(null);
  const router = useRouter();

  const onHashChangeStart = () => {
    if (window.location.hash) {
      setUrlFragment(window.location.hash.substring(1));
    }
  };

  useEffect(() => {
    onHashChangeStart();
  }, [router.asPath]);
  return (
    <MainLayout
      title="FAQ - KHYN HQ"
      className="mx-auto pb-20 pt-20 flex flex-col h-full w-full max-w-screen-xl px-6 sm:px-16"
    >
      <h1 className="text-xl font-bold">Frequently Asked Questions</h1>
      <Accordion
        className="w-full mt-8"
        type="single"
        collapsible
        value={urlFragment || selectedAccordion}
        onValueChange={() => {
          setUrlFragment(null);
        }}
      >
        {FAQ_DATA.map((oneFAQSection, index) => (
          <AccordionSection
            key={index}
            heading={oneFAQSection.heading}
            contents={oneFAQSection.contents}
            className="mt-8"
            selectedAccordion={selectedAccordion}
            setSelectedAccordion={setSelectedAccordion}
          />
        ))}
      </Accordion>
    </MainLayout>
  );
};

export default FAQ;
