import boom from 'boom';

import { categoryModel } from '../models/Category';

export const getSingleCategory = async (req) => {
  try {
    const id = req.params.id;
    const category = await categoryModel.findById(id);
    return category;
  } catch (error) {
    throw boom.boomify(error);
  }
};

export const getAllCategory = async (req) => {
  try {
    const category = await categoryModel.find();
    return category;
  } catch (error) {
    throw boom.boomify(error);
  }
};

// カテゴリーの新規追加
export const createNewCategory = async (req) => {
  try {
    const category = new categoryModel(req.body);
    const newCategory = await category.save();
    return newCategory;
  } catch (error) {
    throw boom.boomify(error);
  }
};
