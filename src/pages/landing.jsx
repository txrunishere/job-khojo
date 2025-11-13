import { Heading, JobSearchFilter } from "@/components";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRef } from "react";
import { useNavigate } from "react-router";
import Autoplay from "embla-carousel-autoplay";
import companies from "@/data/companies.json";
import { Card, CardContent } from "@/components/ui/card";

export const Landing = () => {
  const titleInputRef = useRef();
  const locationInputRef = useRef();
  const navigate = useNavigate();

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const handleSearch = () => {
    if (!titleInputRef.current.value && !locationInputRef.current.value) return;

    navigate(
      `/jobs?location=${locationInputRef.current.value.trim().toLowerCase()}&title=${titleInputRef.current.value.trim().toLowerCase()}`,
    );
  };

  return (
    <div className="space-y-7 sm:space-y-14">
      <section className="space-y-2">
        <Heading>Get The Right Job You Deserve</Heading>
      </section>
      <div>
        <JobSearchFilter
          locationInputRef={locationInputRef}
          titleInputRef={titleInputRef}
          handleSearch={handleSearch}
        />
      </div>
      <div className="px-4">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {companies.map((company) => (
              <CarouselItem
                className={"basis-1/3 sm:basis-1/4 lg:basis-1/5"}
                key={company.id}
              >
                <Card
                  className={"items-center justify-center py-3 sm:py-2 lg:py-5"}
                >
                  <CardContent>
                    <img
                      className="h-8 w-auto object-contain sm:h-16"
                      src={company.path}
                      alt=""
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
