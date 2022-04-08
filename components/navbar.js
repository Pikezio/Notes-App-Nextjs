import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Search from "./search";
import {
  Container,
  Nav,
  Navbar as BNavbar,
  NavItem,
  Button,
} from "react-bootstrap";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <BNavbar expand="lg">
      <Container>
        <Link href="/" passHref>
          <BNavbar.Brand>🎵 NotesApp</BNavbar.Brand>
        </Link>
        <BNavbar.Toggle aria-controls="navbar" />
        <BNavbar.Collapse id="navbar">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "200px" }}
            navbarScroll
          >
            {session ? (
              <>
                <NavItem>
                  <Link href="/" passHref>
                    <Nav.Link>Pagrindinis</Nav.Link>
                  </Link>
                </NavItem>

                <Link href="/collectives/all" passHref>
                  <Nav.Link>Visi kolektyvai</Nav.Link>
                </Link>
                <Link href="/collectives/create" passHref>
                  <Nav.Link>Sukurti kolektyvą</Nav.Link>
                </Link>
                <Link href="/collectives/create" passHref>
                  <Nav.Link onClick={() => signOut}>Atsijungti</Nav.Link>
                </Link>
              </>
            ) : (
              <Button variant="light" onClick={() => signIn}>
                Prisijungti
              </Button>
            )}
          </Nav>
          <Search />
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
}
