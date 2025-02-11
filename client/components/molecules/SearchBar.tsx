import { Search, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    // TODO: handle search logic
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1.5 text-[#964F66]" />
      <Input
        value={query}
        onChange={(e) => handleOnchange(e)}
        onClickCapture={handleSearch}
        placeholder="search ..."
        className="bg-[#F2E8EB] text-black/70 placeholder:text-[#964F66] p-2 pl-10 lg:w-80"
      />
      <X
        className="absolute right-2 top-1.5 text-[#964F66]"
        onClick={() => setQuery("")}
      />
    </div>
  );
};

export default SearchBar;
