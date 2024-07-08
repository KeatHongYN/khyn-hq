import { Mail, SquareArrowOutUpRight } from "lucide-react";
import get from "lodash/get";
import {
  EMAIL_INCLUDED_REGEX,
  EMAIL_OR_HTTPS_INCLUDED_REGEX,
  HTTPS_INCLUDED_REGEX
} from "./config";

const useTextWithAnchors = (initialText, linkMap = {}) => {
  let text = initialText;
  const replaceText = (inputText) =>
    inputText.split(EMAIL_OR_HTTPS_INCLUDED_REGEX).map((str, i) => {
      if (HTTPS_INCLUDED_REGEX.test(str)) {
        return (
          <a
            className="font-bold text-[#6772E5] items-center inline-flex"
            href={str}
            key={i}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkMap ? get(linkMap, [str], str) : str}
            <SquareArrowOutUpRight className="ml-1 w-4 h-4" />
          </a>
        );
      }
      if (EMAIL_INCLUDED_REGEX.test(str)) {
        return (
          <a
            className="font-bold text-[#6772E5] items-center inline-flex"
            key={i}
            href={`mailto:${str}`}
          >
            {linkMap ? get(linkMap, [str], str) : str}
            <Mail className="ml-1 w-4 h-4" />
          </a>
        );
      }
      return str;
    });
  text = replaceText(text);

  return text;
};

export default useTextWithAnchors;
