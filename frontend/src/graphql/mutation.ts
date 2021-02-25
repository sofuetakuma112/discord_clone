import { gql } from 'apollo-boost';

export const sendMessageMutation = gql`
  mutation addChat(
    $name: String!
    $message: String!
    $imageData: String!
    $imageTitle: String!
    $channelId: ID!
    $userId: ID!
  ) {
    addChat(
      name: $name
      message: $message
      imageData: $imageData
      imageTitle: $imageTitle
      channel_id: $channelId
      user_id: $userId
    ) {
      _id
      name
      message
      imageData
      imageTitle
      created
      channel_id
      user_id
    }
  }
`;

export const createNewChannel = gql`
  mutation createChannel($name: String!, $categoryId: ID!) {
    createChannel(name: $name, category_id: $categoryId) {
      _id
      name
      category_id
    }
  }
`;

export const createNewCategory = gql`
  mutation createCategory($name: String!) {
    createCategory(name: $name) {
      _id
      name
    }
  }
`;

export const createNewUser = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $password: String!
    $imageConvertedToBase64: String!
    $isAnonymous: Boolean!
    $socketId: String!
  ) {
    createUser(
      name: $name
      email: $email
      password: $password
      imageConvertedToBase64: $imageConvertedToBase64
      is_anonymous: $isAnonymous
      socket_id: $socketId
    ) {
      _id
      name
      email
      imageConvertedToBase64
      socket_id
      is_anonymous
      status
      tokenAndHash
      errorMessage
    }
  }
`;

export const authenticateUser = gql`
  mutation authenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      _id
      name
      email
      imageConvertedToBase64
      is_anonymous
      status
      tokenAndHash
      errorMessage
    }
  }
`;

export const editChat = gql`
  mutation editChat($id: ID!, $message: String!) {
    editChat(_id: $id, message: $message) {
      _id
      message
    }
  }
`;

export const deleteChat = gql`
  mutation deleteChat($id: ID!) {
    deleteChat(_id: $id) {
      _id
      message
    }
  }
`;
