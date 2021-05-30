import { useEffect, useState } from 'react';
import './SidebarChat.css';
import { Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import CreateIcon from '@material-ui/icons/Create';
import CancelIcon from '@material-ui/icons/Cancel';
import db from '../../db/firebase';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '3px',
    outline: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexDirection: 'column',
    '& h2': {
      marginBottom: '20px',
    },
  },
  button: {
    margin: theme.spacing(1),
    marginTop: '20px',
  },
}));

function SidebarChat({ addNewChat, id, name, avatar }) {
  const classes = useStyles();

  const [seed, setSeed] = useState('');
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRoomName('');
  };

  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [open]);

  const createChat = () => {
    if (roomName) {
      db.collection('rooms').add({
        name: roomName,
        avatar: `https://avatars.dicebear.com/api/human/${seed}.svg`,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      handleClose();
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={avatar} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <>
      <div className="sidebarChat" onClick={handleOpen}>
        <h2>Add new Chat</h2>
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Create Room</h2>
            <TextField
              id="outlined-basic"
              label="Room name"
              variant="outlined"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <div className="sidebarChat__btn">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<CreateIcon />}
                onClick={createChat}
                disabled={!roomName}
              >
                Create
              </Button>

              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<CancelIcon />}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default SidebarChat;
