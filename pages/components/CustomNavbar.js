import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import { instrumentState, instrumentListState } from "../../atoms";
import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../util/urlConfig";
import { useRouter } from "next/router";

export default function CustomNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { collectiveId } = router.query;
  const { pathname } = router;
  const [instruments, setInstruments] = useState([]);
  const setInstrument = useSetRecoilState(instrumentState);
  // const [instrumentList, setInstrumentList] =
  //   useRecoilState(instrumentListState);

  // When pathname changes
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  // When collectiveId changes
  useEffect(() => {
    if (collectiveId) {
      const getInstruments = async () => {
        const response = await axios.get(
          `${server}/api/collectives/${collectiveId}/instruments`
        );
        setInstruments(response.data.instruments);
      };
      getInstruments();
    }
  }, [collectiveId]);

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">NotesApp</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {session ? (
            <>
              <Nav className="me-auto">
                <Link href={`/collectives`} passHref>
                  <Nav.Link>Kolektyvai</Nav.Link>
                </Link>
              </Nav>

              <Nav className="me-auto">
                <Link href={`/songs`} passHref>
                  <Nav.Link>Kūriniai</Nav.Link>
                </Link>
              </Nav>

              <select
                name="part"
                id="part"
                onChange={(e) => setInstrument(e.target.value)}
              >
                {instruments &&
                  instruments.map((i, idx) => (
                    <option key={idx} value={i}>
                      {i}
                    </option>
                  ))}
              </select>

              <Navbar.Text>
                Prisijungta: {session.user.email} {session.id}
              </Navbar.Text>
              <NavDropdown>
                <NavDropdown.Item onClick={signOut}>
                  Atsijungti
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <Nav.Link onClick={signIn}>Prisijungti</Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
