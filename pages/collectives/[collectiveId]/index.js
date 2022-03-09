import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

function Collective({}) {
  const { collectiveId } = useRouter().query;

  return (
    <div>
      <h1>Kūriniai:</h1>
      <ul>
        <li>Fake 1</li>
        <li>Fake 2</li>
        <li>Fake 3</li>
        <li>Fake 4</li>
      </ul>
      <Link href={`${collectiveId}/songs/create`}>
        <a>Pridėti kūrinį</a>
      </Link>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   const data = await fetch(`${server}/api/users/${session.userId}/collectives`);
//   const collectives = await data.json();

//   return {
//     props: {
//       data: collectives,
//     },
//   };
// }

export default Collective;
