import { Hero } from '@/components/home/hero';
import { TrustStrip } from '@/components/home/trust-strip';
import { QuickCategories } from '@/components/home/quick-categories';
import { FeaturedTours } from '@/components/home/featured-tours';
import { ToursByCountry } from '@/components/home/tours-by-country';
import { SchedulePreview } from '@/components/home/schedule-preview';
import { WhyGoTravel } from '@/components/home/why-go-travel';
import { Testimonials } from '@/components/home/testimonials';
import { PastToursGallery } from '@/components/home/past-tours-gallery';
import { TravelArticles } from '@/components/home/travel-articles';
import { NewsletterStrip } from '@/components/home/newsletter-strip';
import { Faq } from '@/components/home/faq';
import { FinalCta } from '@/components/home/final-cta';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <QuickCategories />
      <FeaturedTours />
      <ToursByCountry />
      <SchedulePreview />
      <WhyGoTravel />
      <Testimonials />
      <PastToursGallery />
      <TravelArticles />
      <NewsletterStrip />
      <Faq />
      <FinalCta />
    </>
  );
}
