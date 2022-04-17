import React, { Fragment, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import Image from "next/image";
import { Button, Form } from "react-bootstrap";
import { useRouter } from "next/router";

function Search() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");

  const handleSearch = (query) => {
    setIsLoading(true);
    setInput(query);
    axios
      .get(`/api/songSearch?search=${query}`)
      .then((res) => {
        const options = res.data.map((song) => ({
          id: song._id,
          title: song.title,
          collectiveTitle: song.collectiveTitle,
          collectiveId: song.collectiveId,
          collectiveLogo: song.collectiveLogo,
        }));
        setOptions(options);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <AsyncTypeahead
        id="search"
        minLength={3}
        isLoading={isLoading}
        filterBy={() => true}
        onSearch={handleSearch}
        labelKey="title"
        options={options}
        placeholder="Paieška..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.replace(`/songs?filter=${input}`);
          }
        }}
        renderMenuItemChildren={(option) => (
          <Fragment>
            <Link
              href={`/collectives/${option.collectiveId}/songs/${option.id}?part=all`}
              passHref
            >
              <div className="d-flex justify-content-between">
                {option.title}
                <div className="d-flex align-items-center">
                  <small className="mx-2"> {option.collectiveTitle}</small>
                  {option.collectiveLogo && (
                    <Image
                      alt="logo"
                      src={option.collectiveLogo}
                      width={25}
                      height={25}
                      className="rounded-circle"
                    />
                  )}
                </div>
              </div>
            </Link>
          </Fragment>
        )}
      />

      <Button
        className="mx-2"
        onClick={(e) => {
          router.push(`/songs?filter=${input}`);
        }}
      >
        Ieškoti
      </Button>
    </>
  );
}

export default Search;
