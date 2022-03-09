import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Layout({ children }) {
  return (
    <>
      <CustomNavbar />
      <main>{children}</main>
    </>
  );
}

export function CustomNavbar() {
  const { data: session } = useSession();
  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">NotesApp</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {session ? (
            <>
              {/* {collectives ? (
                <Nav className="me-auto">
                  <Link href={`/collectives/${collectives.data._id}`} passHref>
                    <Nav.Link> {collectives.data.title}</Nav.Link>
                  </Link>
                </Nav>
              ) : (
                <Nav className="me-auto">
                  <Link href="/collectives/create" passHref>
                    <Nav.Link>Sukurti kolektyvą</Nav.Link>
                  </Link>
                </Nav>
              )} */}
              <Nav className="me-auto">
                <Link href={`/collectives`} passHref>
                  <Nav.Link>Kolektyvai</Nav.Link>
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
            <Nav.Link onClick={() => signIn("google")}>Prisijungti</Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
