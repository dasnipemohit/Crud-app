import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, Container,Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from "../firebase"
import ModalComp from '../components/ModalComp';
import Spinner from '../components/Spinner';


const Home = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {

      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() })
      });
      setUsers(list);
      setLoading(false);
    },
      (error) => {
        // console.log(" error the data lkl kll", error, "The Http");
      });
    return () => {
      unsub();
    };
  }, []);
  if (loading) {
    return <Spinner />
  }

  const handleModal = (item) => {
    setOpen(true);
    setUser(item);
  };

  const handleDelete = async (id) => {

      try {
         setOpen(false);
         await deleteDoc(doc(db, "users", id));
         // setUser(users.filter((user) => user.id !== id));
       } catch (err) {
         console.log("the  Data is Error", err);
     }
  }
  return (
    <Container>
      <Grid columns={3} stackable>
        {users && users.map((item) => (
          <Grid.Column key={item.id}>
            <Card >
              <Card.Content>
                <Image
                  src={item.img}
                  size='medium'
                  style={{
                    height: "150px",
                    width: "150px",
                    borderRadius: "50%",
                  }}
                />
                <Card.Header style={{ marginTop: "10px" }}>
                  {item.name}
                </Card.Header>
                <Card.Description>{item.info}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div>
                  <Button color="green"
                    onClick={() => navigate(`/update/${item.id}`)}
                  >
                    Update
                  </Button>
                  <Button color="purple"
                    onClick={() => handleModal(item)}
                  >
                    View
                  </Button>
                  {open && (
                    <ModalComp
                      open={open}
                      setOpen={setOpen}
                      handleDelete = {() => handleDelete(item.id)}
                      {...user}
                    />
                  )}
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  )
}

export default Home;