import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from "../connection";

export class CommentModel extends Model<InferAttributes<CommentModel>, InferCreationAttributes<CommentModel>>{
  declare id: CreationOptional<number>;
  declare UserModelId: number;
  declare ArticleModelId: number;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const Comment = CommentModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  UserModelId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  ArticleModelId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  tableName: 'comments',
  sequelize
});