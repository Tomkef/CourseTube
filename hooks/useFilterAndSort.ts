import { useEffect, useState } from "react";
import { Video } from "types";

function compareByTitle(a: { video: Video }, b: { video: Video }) {
  if (a.video.title.toLowerCase() < b.video.title.toLowerCase()) {
    return -1;
  }
  if (a.video.title.toLowerCase() > b.video.title.toLowerCase()) {
    return 1;
  }
  return 0;
}

function compareByProgress(a: { video: Video }, b: { video: Video }) {
  if (a.video.completedPercent < b.video.completedPercent) {
    return -1;
  }
  if (a.video.completedPercent > b.video.completedPercent) {
    return 1;
  }
  return 0;
}

const useFilterAndSort = () => {
  const [userCourses, setUserCourses] = useState<{ video: Video }[]>();
  const [sortByValue, setSortByValue] = useState("title");
  const [filterByValue, setFilterByValue] = useState(null);
  const [filteredAndSortedCourses, setFilteredAndSortedCourses] =
    useState<{ video: Video }[]>();

  const [searchValue, setSearchValue] = useState<string>("");

  const filterCoursesByValue = () => {
    if (filterByValue === "notStarted") {
      const notStatredCourses = userCourses.filter((course) => {
        return course.video.completedPercent === 0;
      });
      setFilteredAndSortedCourses(notStatredCourses);
    } else if (filterByValue === "inProgress") {
      const inProgressCourses = userCourses.filter((course) => {
        return course.video.completedPercent > 0;
      });
      setFilteredAndSortedCourses(inProgressCourses);
    } else {
      setFilteredAndSortedCourses(userCourses);
    }
  };

  useEffect(() => {
    filterCoursesByValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByValue]);

  const sortCoursesByValue = () => {
    if (!filteredAndSortedCourses) return;
    if (sortByValue === "title") {
      setFilteredAndSortedCourses((prev) => {
        const newOrder = [...prev];
        return newOrder.sort(compareByTitle);
      });
    } else if (sortByValue === "progress") {
      setFilteredAndSortedCourses((prev) => {
        const newOrder = [...prev];
        return newOrder.sort(compareByProgress);
      });
    }
  };

  useEffect(() => {
    sortCoursesByValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortByValue]);

  useEffect(() => {
    if (!userCourses) return;
    setFilteredAndSortedCourses(userCourses.sort(compareByTitle));
  }, [userCourses]);

  useEffect(() => {
    if (!filteredAndSortedCourses) return;
    if (searchValue === "") {
      setFilteredAndSortedCourses(userCourses);
      return;
    }
    setFilteredAndSortedCourses(() => {
      const searchValueLowerCase = searchValue.toLowerCase();
      return userCourses.filter((course) => {
        const isInTitle = course.video.title
          .toLowerCase()
          .includes(searchValueLowerCase);
        const isInChannelTitle = course.video.channelTitle
          .toLowerCase()
          .includes(searchValueLowerCase);
        return isInChannelTitle || isInTitle;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return {
    data: filteredAndSortedCourses,
    setAllData: setUserCourses,
    sortByValue,
    setSortByValue,
    filterByValue,
    setFilterByValue,
    searchValue,
    setSearchValue,
  };
};

export default useFilterAndSort;
