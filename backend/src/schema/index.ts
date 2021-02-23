// Import External Dependancies
import * as graphql from 'graphql';
import fastify from '../server';
import { resolve } from 'path';
import fetch from 'node-fetch';
import * as queries from '../query/index';
import { io } from '../server';

const url = `http://localhost:3000/graphql`;

// Destructure GraphQL functions
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
} = graphql;

// Import Controllers
import * as categoryController from '../controllers/categoryController';
import * as channelController from '../controllers/channelController';
import * as chatController from '../controllers/chatController';
import * as userController from '../controllers/userController';

// GraphQL オブジェクト型を宣言します。
// これは、パラメータとしてオブジェクトを受け取り、
// 名前とフィールドキーを指定する関数
// これらの関数は、先ほど定義した Mongoose モデルと同様に、
// GraphQL スキーマを定義するために使用します。
const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    _id: { type: GraphQLID },
    socket_id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    is_anonymous: { type: GraphQLString },
  }),
});

const chatType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    message: { type: GraphQLString },
    created: { type: GraphQLString },
    channel_id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    user: {
      type: userType,
      async resolve(parent, args) {
        const result = await userController.getSingleUser({
          id: parent.user_id,
        });
        return result;
      },
    },
  }),
});

// リゾルバ関数またはメソッドは、
// スキーマの型またはフィールドの値を解決する関数です。
// フィールドが実行されると、対応するリゾルバが呼び出され、次の値が生成される。
const channelType = new GraphQLObjectType({
  name: 'Channel',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    category_id: { type: GraphQLID },
    chats: {
      type: new GraphQLList(chatType),
      async resolve(parent, args) {
        return await chatController.getChatsChannel({ id: parent._id });
      },
    },
  }),
});

const categoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    channels: {
      type: new GraphQLList(channelType),
      async resolve(parent, args) {
        // オブジェクトで渡す必要がある（そうしないとバッファ型で送信される）
        return await channelController.getChannelsCategory({ id: parent._id });
      },
    },
  }),
});

// Define Root Query
// GraphQL APIのすべてのエントリーポイント
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    channel: {
      type: channelType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await channelController.getSingleChannel(args);
      },
    },
    categories: {
      type: new GraphQLList(categoryType),
      async resolve(parent, args) {
        return await categoryController.getAllCategory();
      },
    },
  },
});

// Define Mutations
// データを変更するために使用する Mutation を宣言します。
const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    addChat: {
      type: chatType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: new GraphQLNonNull(GraphQLString) },
        channel_id: { type: GraphQLID },
        user_id: { type: GraphQLID },
      },
      async resolve(parent, args) {
        const data = await chatController.addChat(args);
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queries.allQuery }),
        })
          .then((response) => response.json())
          .then((data) => {
            io.emit('latestData', JSON.stringify(data));
          });
        return data;
      },
    },
    createChannel: {
      type: channelType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        category_id: { type: GraphQLID },
      },
      async resolve(parent, args) {
        const data = await channelController.createNewChannel(args);
        fetchLatestCategories();
        return data;
      },
    },
    createCategory: {
      type: categoryType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const data = await categoryController.createNewCategory(args);
        // ここでwebsocketを使って最新のカテゴリーデータをクライアントに送信
        fetchLatestCategories();
        return data;
      },
    },
  },
});

const fetchLatestCategories = async () => {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: queries.categoriesQuery }),
  })
    .then((response) => response.json())
    .then((data) => {
      io.emit('latestCategories', JSON.stringify(data));
    });
};

// Export the schema
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
