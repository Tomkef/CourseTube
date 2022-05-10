import { useState, useEffect, Fragment } from "react";

import { Group, Input, Button, LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mantine/hooks";

import { VideoIcon } from "@modulz/radix-icons";

const extractVideoIdFromURL = (inputURL: string) => {
  const regExp =
    /youtu.be\/(?<id>.{11}).*$|youtube.(com|com.br|co.nz|de|es|it|nl|ru)\/.*\?v=(?<id2>.{11}).*$/gm;
  const match = regExp.exec(inputURL);
  const videoId = match?.groups?.id || match?.groups?.id2;

  return videoId;
};

const AddCourse = () => {
  const router = useRouter();

  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(false);

  const [userURLInput, setUserURLInput] = useState<string>();

  const [isSearchDisabled, setIsSearchDisabled] = useState<boolean>(true);

  const smallerThanMedium = useMediaQuery("(max-width: 992px)");

  const addCourseHandler = () => {
    setShowLoadingOverlay(true);
    const videoId = extractVideoIdFromURL(userURLInput);

    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}${videoId}`);
  };

  const handleUserInputChange = (event) => {
    setUserURLInput(event.target.value);
  };

  useEffect(() => {
    const videoId = extractVideoIdFromURL(userURLInput);
    setIsSearchDisabled(!videoId);
  }, [userURLInput]);

  return (
    <Fragment>
      <LoadingOverlay visible={showLoadingOverlay} />

      <Group
        spacing={0}
        position="center"
        direction="row"
        sx={{ marginBottom: 30 }}
      >
        <Input
          size="sm"
          icon={<VideoIcon />}
          sx={{
            width: smallerThanMedium ? "64vw" : "30vw",
          }}
          radius="md"
          placeholder={`Enter Youtube video's URL`}
          onChange={handleUserInputChange}
        />
        <Button
          size="sm"
          onClick={addCourseHandler}
          disabled={isSearchDisabled}
        >
          Add
        </Button>
      </Group>
    </Fragment>
  );
};

export default AddCourse;
