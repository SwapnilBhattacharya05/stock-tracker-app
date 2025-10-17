"use client";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Loader2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const SearchCommand = ({
  label = "Add stock",
  renderAs = "button",
  initialStocks,
}: SearchCommandProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedTerm] = useDebounce(searchTerm, 300);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);
  const isSearchMode = !!debouncedTerm.trim(); // TURNS IT INTO A REAL BOOLEAN
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);
    setLoading(true);
    try {
      const results = await searchStocks(debouncedTerm.trim());
      setStocks(results);
    } catch (e) {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void handleSearch(); // void USED TO SUPPRESS THE RETURN VALUE OF THE FUNCTION
  }, [debouncedTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  return (
    <>
      {renderAs === "text" ? (
        <span className="search-text" onClick={() => setOpen(true)}>
          {label}
        </span>
      ) : (
        <Button className="search-btn" onClick={() => setOpen(true)}>
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <div className="search-field">
          <CommandInput
            value={searchTerm}
            onValueChange={(e) => setSearchTerm(e)}
            placeholder="Search stocks..."
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No results found." : "No stocks available."}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search results" : "Popular stocks"}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                <li key={stock.symbol} className="search-item">
                  <Link
                    href={`/stock/${stock.symbol}`}
                    onClick={() => handleSelectStock(stock.symbol)}
                    className="search-item-link"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    <Star />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <CommandShortcut className="ml-2">
            ⌘ or Ctrl + K to open
          </CommandShortcut>
        </CommandList>
      </CommandDialog>
    </>
  );
};
export default SearchCommand;
