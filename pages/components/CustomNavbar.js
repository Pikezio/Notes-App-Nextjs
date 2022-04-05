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
