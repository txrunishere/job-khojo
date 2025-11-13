import { useIsMobile } from "@/hooks";
import { MapPin, Search } from "lucide-react";
import { Button } from "./ui/button";

export const JobSearchFilter = ({
  locationInputRef,
  titleInputRef,
  handleSearch,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-center">
      {isMobile ? (
        <div className="flex flex-col gap-3 p-2">
          <div className="flex items-center gap-2 rounded-full border px-3 py-2">
            <Search size={16} />
            <input
              ref={titleInputRef}
              className="placeholder:text-sm focus:outline-none"
              type="text"
              placeholder="Job title or keyword"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border px-3 py-2">
            <MapPin size={16} />
            <input
              ref={locationInputRef}
              className="placeholder:text-sm focus:outline-none"
              type="text"
              placeholder="Delhi, India"
            />
          </div>
          <div>
            <Button onClick={handleSearch} className={"w-full rounded-full"}>
              Search
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-full border p-2">
            <div className="ml-2 flex items-center gap-2">
              <Search size={16} />
              <input
                ref={titleInputRef}
                className="w-40 placeholder:text-sm focus:outline-none"
                type="text"
                placeholder="Job title or keyword"
              />
            </div>
            <div>| </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <input
                ref={locationInputRef}
                className="w-40 placeholder:text-sm focus:outline-none"
                type="text"
                placeholder="Delhi, India"
              />
            </div>
            <div>
              <Button onClick={handleSearch} className={"rounded-full"}>
                Search
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
