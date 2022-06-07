import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from "../connection";

export class ArticleModel extends Model<InferAttributes<ArticleModel>, InferCreationAttributes<ArticleModel>> {
  declare id: CreationOptional<number>;
  declare UserModelId: number;
  declare title: string;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const Article = ArticleModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  UserModelId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,

  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  tableName: 'articles',
  sequelize
});

