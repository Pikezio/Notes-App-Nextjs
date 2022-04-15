import React, { Fragment, useState } from "react";
import axios from "axios";
import Link from "next/link";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import Image from "next/image";

function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const handleSearch = (query) => {
    setIsLoading(true);
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
    <AsyncTypeahead
      id="search"
      minLength={3}
      isLoading={isLoading}
      filterBy={() => true}
      onSearch={handleSearch}
      labelKey="title"
      options={options}
      placeholder="Paieška..."
      renderMenuItemChildren={(option, props) => (
        <Fragment>
          <Link
            href={`/songs/${option.id}?collectiveId=${option.collectiveId}`}
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
  );
}

export default Search;
