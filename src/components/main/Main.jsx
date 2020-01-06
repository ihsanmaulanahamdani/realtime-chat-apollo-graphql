import React, { useState, useEffect } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";

import "./main.css";

import Chat from "./Chat";

const CHAT_ADDED = gql`
  mutation createMessage($userId: String, $content: String) {
    createMessage(userId: $userId, content: $content) {
      content
      User {
        _id
      }
    }
  }
`;

const LOG_IN = gql`
  mutation logIn($phoneNumber: String, $password: String) {
    logIn(phoneNumber: $phoneNumber, password: $password) {
      _id
    }
  }
`;

const CHATS = gql`
  query chats {
    chats {
      _id
      content
      User {
        _id
      }
    }
  }
`;

function Main() {
  const [content, setContent] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("id"));
  }, [token, setToken]);

  async function onSubmitText(e, chatAdded) {
    e.preventDefault();

    await chatAdded({
      variables: {
        userId: token,
        content
      }
    });

    setContent("");
  }

  async function onLoginSubmit(e, login) {
    e.preventDefault();

    const {
      data: {
        logIn: { _id }
      }
    } = await login({
      variables: {
        phoneNumber,
        password
      }
    });

    setPhoneNumber("");
    setPassword("");
    localStorage.setItem("id", _id);
    setToken(_id);
  }

  return (
    <div className="main-background">
      <div className="chat">
        <Query query={CHATS}>
          {({ data, loading, error, subscribeToMore }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>{error.message}</div>;

            console.log(data.chats)

            return (
              <Chat token={token} chats={data.chats} subscribeToMore={subscribeToMore} />
            );
          }}
        </Query>
      </div>
      <div className="input-text">
        {!token ? (
          <Mutation mutation={LOG_IN}>
            {login => {
              return (
                <form onSubmit={e => onLoginSubmit(e, login)}>
                  <input
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    type="text"
                  />
                  <input
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                  />
                  <input type="submit" value="Log In" />
                </form>
              );
            }}
          </Mutation>
        ) : (
          <Mutation mutation={CHAT_ADDED}>
            {chatAdded => {
              return (
                <form onSubmit={e => onSubmitText(e, chatAdded)}>
                  <input
                    type="text"
                    onChange={e => setContent(e.target.value)}
                    value={content}
                    placeholder="Tulis pesan"
                  />
                </form>
              );
            }}
          </Mutation>
        )}
      </div>
    </div>
  );
}

export default Main;
