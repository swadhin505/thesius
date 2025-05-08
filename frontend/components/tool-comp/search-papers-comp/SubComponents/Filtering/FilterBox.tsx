import React, { useEffect, useState } from "react";
import { Button, Combobox } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import ToggleSwitch from "./ToggleSwitch";
import topics from "./FilterData/topics.json";
import resourceTypes from "./FilterData/resourceTypes.json";
import {
  fetchTopics,
  fetchTopicsCache,
  Topic,
} from "@/lib/tools/advancedsearchengine/fetchTopics";
import { SearchPaperPage, useSearchPaper } from "@/context/SearchPapersContext";
import {
  fetchAnswerAdvanced,
  FilterData,
} from "@/lib/tools/advancedsearchengine/fetchAnswer";

const currentYear = new Date().getFullYear();
const oldestYear = 1990;
const years = [
  "All",
  ...Array.from({ length: currentYear - oldestYear + 1 }, (_, i) =>
    (currentYear - i).toString()
  ),
];

export interface ResourceType {
  display_name: string;
  description: string;
}

export interface TopicsProps {
  selectedTopicsData: Topic[];
}

const ResourceTypes: ResourceType[] = resourceTypes;

export default function FilterBox({ selectedTopicsData }: TopicsProps) {
  const [publishedSince, setPublishedSince] = useState("All");
  const [openAccess, setOpenAccess] = useState(false);
  const [citations, setCitations] = useState("0");
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<
    ResourceType[]
  >([]);
  const [selectedTopics, setSelectedTopics] =
    useState<Topic[]>(selectedTopicsData);
  const [sourceTypeQuery, setSourceTypeQuery] = useState("");
  const [topicQuery, setTopicQuery] = useState("");

  const {
    searchPaperPage,
    setSearchPaperPage,
    paperRetrievalLoading,
    setPaperRetrievalLoading,
    paperRetrievalQuery,
    setPaperRetrievalQuery,
    isAtComplexMode,
    setIsAtComplexMode,
  } = useSearchPaper(); // Use the hook

  const filteredSourceTypes =
    sourceTypeQuery === ""
      ? resourceTypes
      : resourceTypes.filter((type) =>
          type.display_name
            .toLowerCase()
            .includes(sourceTypeQuery.toLowerCase())
        );

  const filteredTopics =
    topicQuery === ""
      ? topics.slice(0, 10) // Show only the first 10 topics when there's no query
      : topics
          .filter((topic) =>
            topic.display_name.toLowerCase().includes(topicQuery.toLowerCase())
          )
          .slice(0, 10); // Show only the top 10 matches

  const removeSourceType = (typeToRemove: ResourceType) => {
    setSelectedSourceTypes(
      selectedSourceTypes.filter((type) => type !== typeToRemove)
    );
  };

  const removeTopic = (topicToRemove: Topic) => {
    setSelectedTopics(
      selectedTopics.filter((topic) => topic.only_id !== topicToRemove.only_id)
    );
  };

  const handleSubmit = async () => {
    const ParcelData: FilterData = {
      query: paperRetrievalQuery,
      // selectedTopics,
      publishedSince: publishedSince,
      openAccess: openAccess,
      citations: citations,
      // selectedSourceTypes,
    };

    try {
      setPaperRetrievalLoading(true)
      const data = await fetchAnswerAdvanced(ParcelData);
      console.log("Response data:", data);
      if (data) {
        const newSearchPaperPage: SearchPaperPage = {
          query: data.query,
          queryResult: data,
          library: [],
        };
        setSearchPaperPage(newSearchPaperPage);
        setPaperRetrievalQuery(data.query);
        setIsAtComplexMode(false);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
    setPaperRetrievalLoading(false);
  };

  if (!paperRetrievalLoading && isAtComplexMode) {
      return (
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Topics of the query
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              Are this topics suitable for your query ?
            </h2>
            <p className="my-2 font-semibold">
              You can add or remove topics if you wish to.
            </p>
            <Combobox value={selectedTopics} onChange={setSelectedTopics} multiple>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    onChange={(event) => setTopicQuery(event.target.value)}
                    // displayValue={(topics: Topic[]) => topics.map(topic => topic.display_name).join(', ')}
                    placeholder="Search for topics..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-green-500 ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {filteredTopics.length === 0 && topicQuery !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredTopics.map((topic) => (
                      <Combobox.Option
                        key={topic.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-green-600 text-white mx-4 rounded-xl"
                              : "text-gray-900"
                          }`
                        }
                        value={topic}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {topic.display_name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-green-600"
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </div>
            </Combobox>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTopics.map((topic) => (
                <div
                  key={topic.only_id}
                  className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center"
                >
                  {topic.display_name}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div> */}
    
          {/* Other Filters */}
          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-4">
              Filters to choose from
            </h2>
            <p className="my-2 font-semibold">
              These are some filters you can choose from.
            </p>
            {/* Published Since */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Published Since</h3>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    className={`px-3 py-1 rounded-full text-sm ${
                      publishedSince === year
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setPublishedSince(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
    
            {/* Open Access */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Open Access</h3>
              <p className="my-2 font-semibold">
                This filter while on, finds you the only papers whose pdf can be
                accessed and chat with. This filter can limit the amount of papers.
              </p>
              <ToggleSwitch enabled={openAccess} setEnabled={setOpenAccess} />
            </div>
    
            {/* Citations */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Citations ≥</h3>
              <input
                type="number"
                value={citations}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    // Allow only whole numbers
                    setCitations(value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter minimum citations"
              />
            </div>
    
            {/* Source Type */}
            {/* <div>
              <h3 className="text-lg font-semibold mb-2">Source Type</h3>
              <Combobox
                value={selectedSourceTypes}
                onChange={setSelectedSourceTypes}
                multiple
              >
                <div className="relative mt-1">
                  <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-green-300 sm:text-sm">
                    <Combobox.Input
                      className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      onChange={(event) => setSourceTypeQuery(event.target.value)}
                      // displayValue={(types: string[]) => types.join(', ')}
                      placeholder="Select source types..."
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-green-500 ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {filteredSourceTypes.length === 0 && sourceTypeQuery !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredSourceTypes.map((type) => (
                        <Combobox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-green-600 text-white mx-4 rounded-xl"
                                : "text-gray-900"
                            }`
                          }
                          value={type}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {type.display_name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-green-600"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </div>
              </Combobox>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSourceTypes.map((type) => (
                  <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    {type.display_name}
                    <button
                      onClick={() => removeSourceType(type)}
                      className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
    
          {/* Submit */}
          <div className="w-full flex justify-center items-center">
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 rounded-full text-center mx-auto my-4 py-3 px-4 text-white font-semibold"
            >
              Finalize and get result
            </Button>
          </div>
        </div>
      );
  }

  return <></>
}
