import React from "react";
import { getSong } from "../../../../../controllers/songController";
import { getInstruments } from "../../../../../controllers/instrumentController";
import EditSong from "../../../../../components/Song/editSong";
import EditPart from "../../../../../components/Song/editPart";
import AddPart from "../../../../../components/Song/addPart";
import { Container, ListGroup } from "react-bootstrap";
import { checkSession } from "../../../../../middleware/checkSession";

function Edit({ song, instrumentList }) {
  const dashes = (
    <option key={0} value="---">
      ---
    </option>
  );
  const list =
    instrumentList &&
    instrumentList.map((instrument, idx) => (
      <option key={++idx} value={instrument}>
        {instrument}
      </option>
    ));
  const optionList = [dashes, ...list];

  return (
    <Container>
      <EditSong song={song} />

      <h1 className="pt-2">Partijos</h1>
      <ListGroup>
        {song.parts &&
          song.parts.map((part) => (
            <EditPart
              key={part._id}
              optionList={optionList}
              part={part}
              songId={song._id}
            />
          ))}
      </ListGroup>
      <AddPart instrumentList={instrumentList} songId={song._id} />
    </Container>
  );
}

export default Edit;

export async function getServerSideProps(context) {
  const hasSession = await checkSession(context);
  if (hasSession != null) return hasSession;

  const song = JSON.parse(await getSong(context.query.songId));
  const instrumentList = JSON.parse(await getInstruments(song.collectiveId));
  return {
    props: {
      song,
      instrumentList: instrumentList,
    },
  };
}
