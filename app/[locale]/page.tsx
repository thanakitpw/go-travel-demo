import { Hero } from '@/components/home/hero';
import { QuickCategories } from '@/components/home/quick-categories';
import { FeaturedTours } from '@/components/home/featured-tours';

export default function Home() {
  return (
    <>
      <Hero />
      <QuickCategories />
      <FeaturedTours />
    </>
  );
}
