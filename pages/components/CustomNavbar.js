import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function CustomNavbar() {
  const { data: session } = useSession();
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

              <select name="collective" id="collective">
                <option value="1">Collective 1</option>
                <option value="2">Collective 2</option>
                <option value="3">Collective 3</option>
              </select>

              <select name="part" id="part">
                <option value="1">Part 1</option>
                <option value="2">Part 2</option>
                <option value="3">Part 3</option>
                <option value="3">Part 4</option>
                <option value="3">Part 5</option>
                <option value="3">Part 6</option>
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
