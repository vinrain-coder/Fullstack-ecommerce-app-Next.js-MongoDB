"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const testimonials = [
  {
    name: "Jane Doe",
    comment:
      "Shoepedi offers the best quality shoes at great prices! Fast delivery too.",
    rating: 5,
    image: "/images/t-shirts.jpg",
  },
  {
    name: "John Smith",
    comment:
      "Amazing customer support! The shoes are just as described, love them!",
    rating: 5,
    image: "/images/jeans.jpg",
  },
  {
    name: "Lisa Wang",
    comment:
      "Absolutely in love with my new sneakers. Stylish and super comfy!",
    rating: 5,
    image: "/images/shoes.jpg",
  },
  {
    name: "David Kim",
    comment:
      "Affordable prices and top-notch quality. Will definitely shop again!",
    rating: 5,
    image: "/images/wrist-watches.jpg",
  },
];

export function TestimonialCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <div className="w-full mx-auto my-4">
      <Separator className={cn("mb-4")} />
      <h1 className="text-xl font-bold mb-4">Some Customer Reviews</h1>
      <Carousel
        dir="ltr"
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center rounded-xl shadow-md"
              >
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-primary">
                  {testimonial.name}
                </h3>
                <p className="max-w-md">{testimonial.comment}</p>
                <div className="flex mt-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}
