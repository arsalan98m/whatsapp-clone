import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmotionIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from "../../db/firebase";
import { useStateValue } from "../../GlobalState/StateProvider";
import firebase from "firebase/app";

function Chat() {
  const [avatar, setAvatar] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
          setAvatar(snapshot.data().avatar);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      db.collection("rooms").doc(roomId).collection("messages").add({
        message: input,
        name: user?.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      alert("Please enter message..");
    }

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={avatar} />

        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            {messages.length > 0 &&
              `Last seen at ${String(
                new Date(messages[messages.length - 1]?.timestamp?.toDate())
              )}`}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>

          <IconButton>
            <AttachFile />
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => {
          // console.log(message.timestamp.toDate());

          return (
            <p
              key={message.id}
              className={`chat__message ${
                message.name === user.displayName && "chat__reciever"
              }`}
            >
              <span className="chat__name">{message.name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate())?.toLocaleString()}
              </span>
            </p>
          );
        })}

        <div ref={chatRef} className="chat__bottom"></div>
      </div>

      <div className="chat__footer">
        <InsertEmotionIcon />
        <form>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
