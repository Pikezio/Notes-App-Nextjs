import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Form, FormControl } from "react-bootstrap";

function Search() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (input !== "" && input.length > 3) {
      axios
        .get(`/api/songs?search=${input}`)
        .then((res) => setItems(res.data))
        .catch((err) => console.log(err));
    } else setItems([]);
  }, [input]);

  return (
    <div>
      <Form className="d-flex">
        <FormControl
          type="search"
          placeholder="Paieška..."
          className="me-2"
          aria-label="Search"
        />
      </Form>

      {items &&
        items.map((item) => (
          <div key={item.collective._id}>
            Kolektyvas: <strong> {item.collective.title}</strong>
            {item.songs.map((s) => (
              <div key={s._id}>
                <Link
                  href={`/songs/${s._id}?collectiveId=${item.collective._id}`}
                >
                  {s.title}
                </Link>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default Search;
