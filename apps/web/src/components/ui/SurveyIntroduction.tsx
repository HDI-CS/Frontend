import clsx from 'clsx';
import type { ReactNode } from 'react';

import { SURVEY_INTRODUCTION } from '@/constants/notice';

interface SurveyIntroductionProps {
  className?: string;
  type?: 'visual' | 'industry';
}

interface RichSegment {
  text: string;
  highlight?: boolean;
  className?: string;
  breakAfter?: boolean;
}

interface ContentItem {
  type: 'text' | 'highlight' | 'rich';
  content: string | string[] | RichSegment[];
  className?: string;
}

function renderContentItem(item: ContentItem, index: number): ReactNode {
  const { type, content, className } = item;

  switch (type) {
    case 'highlight':
      return (
        <span key={index} className={clsx('font-semibold', className)}>
          {content as string}
        </span>
      );

    case 'rich':
      if (Array.isArray(content)) {
        return (
          <span key={index}>
            {(content as RichSegment[]).map((seg, segIndex) => (
              <span key={segIndex}>
                <span
                  className={clsx(
                    seg.highlight ? 'font-semibold' : undefined,
                    seg.className
                  )}
                >
                  {seg.text}
                </span>
                {seg.breakAfter && <br />}
              </span>
            ))}
          </span>
        );
      }
      return <span key={index}>{content as string}</span>;

    case 'text':
    default:
      return (
        <span key={index} className={className}>
          {content as string}
        </span>
      );
  }
}

export default function SurveyIntroduction({
  className = '',
  type = 'visual',
}: SurveyIntroductionProps) {
  const { TITLE, CONTENT, FOOTER } = SURVEY_INTRODUCTION[type];

  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg border border-gray-100 bg-white p-8 shadow-sm',
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-4xl flex-col justify-between">
        <div>
          <h1 className="mb-8 text-center text-xl font-bold text-gray-900">
            {TITLE}
          </h1>
          <div className="space-y-2 text-[15px] leading-normal text-gray-700">
            {CONTENT.map((item, index) => (
              <p key={index}>{renderContentItem(item, index)}</p>
            ))}
          </div>
        </div>
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
            <span>{FOOTER.RESEARCH_INSTITUTION}</span>
            <span>{FOOTER.CONTACT_EMAIL}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
