import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Search from "./search";
import {
  Container,
  Nav,
  Navbar as BNavbar,
  NavItem,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <BNavbar expand="lg">
      <Container>
        <Link href="/" passHref>
          <BNavbar.Brand>🎵 NotesApp</BNavbar.Brand>
        </Link>
        <BNavbar.Toggle aria-controls="navbar" />
        {session ? (
          <>
            <BNavbar.Collapse id="navbar">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "200px" }}
                navbarScroll
              >
                <NavItem>
                  <Link href="/" passHref>
                    <Nav.Link>Pagrindinis</Nav.Link>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/songs" passHref>
                    <Nav.Link>Kūrinių Biblioteka</Nav.Link>
                  </Link>
                </NavItem>
                <Search />
              </Nav>
            </BNavbar.Collapse>
            <BNavbar.Collapse className="justify-content-end">
              <Nav>
                <NavDropdown
                  title={`Prisijungta: ${session.user.name}`}
                  id="nav-dropdown"
                >
                  <NavDropdown.Item>
                    <Link href="/collectives/create" passHref>
                      Sukurti kolektyvą
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link href="/collectives/all" passHref>
                      Visi kolektyvai
                    </Link>
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => signOut()}>
                    Atsijungti
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </BNavbar.Collapse>
          </>
        ) : (
          <Button variant="light" onClick={() => signIn()}>
            Prisijungti
          </Button>
        )}
      </Container>
    </BNavbar>
  );
}
