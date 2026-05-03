import { useTranslations, useLocale } from 'next-intl';
import { faqs } from '@/data/faqs';
import { pickLocale } from '@/lib/i18n';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Faq() {
  const t = useTranslations('faq');
  const locale = useLocale();

  return (
    <section className="mb-20 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">{t('title')}</h2>
        <p className="text-ink-muted">{t('subtitle')}</p>
      </div>
      <Accordion type="single" collapsible className="bg-white border border-line rounded-2xl px-6">
        {faqs.map((q) => (
          <AccordionItem key={q.id} value={q.id} className="border-line">
            <AccordionTrigger className="cursor-pointer text-left font-semibold hover:text-primary py-5">
              {pickLocale(q.question, locale)}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-ink-muted leading-relaxed pb-5">
              {pickLocale(q.answer, locale)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
