import Link from "next/link";

function ListOfCollectives({ owned, member }) {
  return (
    <div>
      <div>
        <h1>Owned</h1>
        {owned.map((collective) => (
          <Link key={collective._id} href={`/collectives/${collective._id}`}>
            <a>
              <li>{collective.title}</li>
            </a>
          </Link>
        ))}
      </div>
      <div>
        <h1>Member</h1>
        {member.map((collective) => (
          <Link key={collective._id} href={`/collectives/${collective._id}`}>
            <a>
              <li>{collective.title}</li>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ListOfCollectives;
