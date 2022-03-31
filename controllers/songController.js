import Song from "../models/Song";

//Route: /collectives/[collectiveId]/songs - POST, GET

async function getSongs(collectiveId) {
    const collectiveSongs = await Song.find(
        {
            collectiveId,
        },
        "id title"
    );
    return JSON.stringify(collectiveSongs);
}

async function getPartOfSong(req) {
    const {songId, part} = req.query;
    const songWithPart = await Song.findOne(
        {_id: songId, "parts.instrument": part},
        {_id: 1, title: 1, composer: 1, arranger: 1, "parts.$": 1}
    );
    return songWithPart;
}

async function getSong(songId) {
    const song = await Song.findById(songId);
    return JSON.stringify(song);
}

async function postSong(req) {
    const {collectiveId} = req.query;
    const data = {...req.body, collectiveId};
    const song = Song.create(data);
    return song.id;
}

async function deleteSong(req) {
    const {songId} = req.query;
    const song = await Song.findByIdAndDelete(songId);
    return song;
}

async function updateSong(req) {
    const {songId} = req.query;
    const song = await Song.findByIdAndUpdate(songId, req.body);
    return song;
}

async function updatePart(req) {
    const {songId, partId} = req.query
    let setObject = {
        "$set": {
            "parts.$.instrument": req.body.instrument
        }
    }

    if (req.body.file !== null) {
        setObject = {
            "$set": {
                "parts.$.instrument": req.body.instrument,
                "parts.$.file": req.body.file,
            }
        }
    }

    const song = await Song.updateOne({
            _id: songId,
            "parts._id": partId
        },
        setObject
    );
    return {};
}

async function deletePart(req) {
    const {songId, partId} = req.query
    const song = await Song.findById(songId);
    song.parts.pull({_id: partId})
    await song.save();
    return {};
}

async function addPart(req) {
    const {songId} = req.query
    const song = await Song.findById(songId);
    song.parts.push(req.body);
    await song.save();
    return {};
}

module.exports = {
    getSong,
    postSong,
    getSongs,
    getPartOfSong,
    deleteSong,
    updateSong,
    updatePart,
    deletePart,
    addPart
};
