import React, { useEffect } from "react";
import gql from "graphql-tag";

import "./main.css";

const NEW_CHAT = gql`
  subscription {
    newChat {
      _id
      content
      User {
        _id
      }
    }
  }
`;

function Chat(props) {
  const { chats, subscribeToMore } = props;
  useEffect(() => {
    subscribeToMore({
      document: NEW_CHAT,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        return {
          chats: [...prev.chats, subscriptionData.data.newChat]
        };
      }
    });
  }, [subscribeToMore]);

  return chats.map(chat => {
    return chat.User._id === props.token ? (
      <p key={chat._id} className="user-2">
        {chat.content}
      </p>
    ) : (
      <p key={chat._id} className="user-1">
        {chat.content}
      </p>
    );
  });
}

export default Chat;
