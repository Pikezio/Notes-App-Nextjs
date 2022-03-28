import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRecoilState } from "recoil";
import { instrumentState } from "../../atoms";
import { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../util/urlConfig";
import { useRouter } from "next/router";

export default function CustomNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { collectiveId, songId } = router.query;
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] =
    useRecoilState(instrumentState);

  // When collectiveId changes
  useEffect(() => {
    const getInstruments = async () => {
      if (router.isReady && collectiveId) {
        const response = await axios.get(
          `${server}/api/collectives/${collectiveId}/instruments`
        );

        setInstruments(["---", ...response.data.instruments]);
        setSelectedInstrument(localStorage.getItem(collectiveId));
      }
    };
    getInstruments();
  }, [router.isReady, collectiveId, setSelectedInstrument]);

  const onInstrumentChange = (e) => {
    setSelectedInstrument(e.target.value);
    localStorage.setItem(collectiveId, e.target.value);
  };

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">NotesApp</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {session ? (
            <>
              <Nav className="me-auto">
                <Link href={`/`} passHref>
                  <Nav.Link>Pagrindinis</Nav.Link>
                </Link>
              </Nav>

              <Nav className="me-auto">
                <Link href={`/collectives/all`} passHref>
                  <Nav.Link>Visi kolektyvai</Nav.Link>
                </Link>
              </Nav>

              <Nav className="me-auto">
                <Link href={`/collectives/create`} passHref>
                  <Nav.Link>Sukurti kolektyvą</Nav.Link>
                </Link>
              </Nav>

              {(collectiveId || songId) && (
                <select
                  name="part"
                  id="part"
                  onChange={onInstrumentChange}
                  value={
                    selectedInstrument ? selectedInstrument : "Nepasirinktas"
                  }
                >
                  {instruments &&
                    instruments.map((i, idx) => (
                      <option key={idx} value={i}>
                        {i}
                      </option>
                    ))}
                </select>
              )}

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
