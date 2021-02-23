export const categoriesQuery = `
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
`;

export const allQuery = `
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
          user {
            _id
            name
            is_anonymous
          }
        }
      }
    }
  }
`;
