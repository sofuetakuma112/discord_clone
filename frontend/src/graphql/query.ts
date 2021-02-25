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
          imageData
          imageTitle
          created
          channel_id
          user_id
          user {
            _id
            name
            email
            is_anonymous
            imageConvertedToBase64
          }
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
        imageData
        imageTitle
        created
        channel_id
        user {
          _id
          name
          is_anonymous
          imageConvertedToBase64
        }
      }
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

export const usersQuery = {
  query: gql`
    {
      users {
        _id
        socket_id
        name
        email
        is_anonymous
        imageConvertedToBase64
      }
    }
  `,
};
