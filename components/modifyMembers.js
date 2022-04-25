import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { Badge, Button, ListGroup } from "react-bootstrap";
import { server } from "../util/urlConfig";

const ModifyMembers = ({ users }) => {
  const router = useRouter();
  const { collectiveId } = router.query;

  const modifyUser = async (userId, action) => {
    await axios
      .patch(`${server}/api/collectives/${collectiveId}/users/${userId}`, {
        action: action,
      })
      .then(() => router.replace(router.asPath))
      .catch((err) => console.log(err));
  };

  const deleteUser = (userId) => {
    if (window.confirm("Ar tikrai norite pašalinti šį narį?")) {
      axios
        .delete(`${server}/api/collectives/${collectiveId}/users/${userId}`)
        .then(() => router.replace(router.asPath))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <h3>Kolektyvo nariai</h3>
      <ListGroup>
        {users &&
          users.map((user) => (
            <ListGroup.Item
              key={user._id}
              className="d-flex justify-content-between"
            >
              {user.name}{" "}
              <div>
                <Badge bg="danger">
                  {user.status === "Declined" && "Atmestas"}
                </Badge>
                {user.status === "Requested" && (
                  <>
                    <Button
                      variant="success"
                      className="px-2 p-0 mx-2"
                      onClick={() => modifyUser(user.userId, "accept")}
                    >
                      Priimti
                    </Button>
                    <Button
                      className="px-2 p-0"
                      variant="danger"
                      onClick={() => modifyUser(user.userId, "decline")}
                    >
                      Nepriimti
                    </Button>
                  </>
                )}
                <Button
                  className="mx-2 p-0 px-2"
                  variant="dark"
                  onClick={() => deleteUser(user.userId)}
                >
                  Pašalinti
                </Button>
              </div>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default ModifyMembers;
