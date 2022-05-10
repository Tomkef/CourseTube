import { Group, Select, TextInput } from "@mantine/core";
import React from "react";
import { Search } from "tabler-icons-react";

const SortsAndFilters = ({
  sortByValue,
  setSortByValue,
  filterByValue,
  setFilterByValue,
  searchValue,
  setSearchValue,
}) => {
  return (
    <Group direction="row">
      <Select
        label="Sort by"
        placeholder="Pick one"
        value={sortByValue}
        sx={{ width: 200 }}
        onChange={setSortByValue}
        data={[
          //{ value: "recentlyViewed", label: "Recently Viewed" },
          //{ value: "newest", label: "Newest" },
          { value: "title", label: "Title" },
          { value: "progress", label: "Progress" },
        ]}
      />
      <Select
        label="Filter by"
        placeholder="Progress"
        clearable
        value={filterByValue}
        sx={{ width: 200 }}
        onChange={setFilterByValue}
        data={[
          { value: "notStarted", label: "Not Started" },
          { value: "inProgress", label: "In Progress" },
        ]}
      />
      <TextInput
        label="Search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        placeholder="Course or channel"
        icon={<Search size={14} />}
      />
    </Group>
  );
};

export default SortsAndFilters;
