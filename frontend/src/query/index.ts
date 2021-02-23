import { gql } from 'apollo-boost';

export const allQuery = gql`
  {
    categories {
      _id
      name
      channels {
        _id
        name
        category_id
        chats {
          _id
          name
          message
          created
          channel_id
        }
      }
    }
  }
`;

export const channelQuery = gql`
  query getChannel($id: ID!) {
    channel(id: $id) {
      _id
      name
      category_id
      chats {
        _id
        name
        message
        created
        channel_id
        user {
          _id
          name
          is_anonymous
        }
      }
    }
  }
`;

export const sendMessageMutation = gql`
  mutation addChat(
    $name: String!
    $message: String!
    $channelId: ID!
    $userId: ID!
  ) {
    addChat(
      name: $name
      message: $message
      channel_id: $channelId
      user_id: $userId
    ) {
      _id
      name
      message
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

export const categoriesQuery = {
  query: gql`
    {
      categories {
        _id
        name
        channels {
          _id
          name
        }
      }
    }
  `,
};
