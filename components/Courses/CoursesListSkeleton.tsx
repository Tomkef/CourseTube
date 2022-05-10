import CourseCardSkeleton from "./CourseCardSkeleton";

const CoursesListSkeleton = ({
  isSmallerThanMedium,
  isUserList,
  viewType,
}: {
  isSmallerThanMedium: boolean;
  isUserList: boolean;
  viewType: "Cards" | "Rows";
}) => {
  const skelteonCardsJSX = [];
  for (let i = 0; i < 5; i++) {
    if (viewType === "Cards") {
      skelteonCardsJSX.push(
        <CourseCardSkeleton
          key={`${isUserList ? "User" : "All"}${i}`}
          isUserCard={isUserList}
        />
      );
    } else {
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: isSmallerThanMedium ? "column" : "row",
        justifyContent: "space-around",
        alignContent: "center",
      }}
    >
      {skelteonCardsJSX}
    </div>
  );
};

export default CoursesListSkeleton;
