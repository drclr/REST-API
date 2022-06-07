import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from "../connection";
import { ArticleModel } from './article';
import { CommentModel } from './comment';

class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<number>;
  declare lastname: string;
  declare firstname: string;
  declare email: string;
  declare password: string;
  declare avatar: CreationOptional<string>;
  declare IsAdmin: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

}

export const User = UserModel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  lastname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isAlpha: true
    }
  },
  firstname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isAlpha: true
    }
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ""
  },
  IsAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  tableName: 'users',
  sequelize
}
);

UserModel.hasMany(ArticleModel);
ArticleModel.belongsTo(UserModel); //idUserModel is added to ArticleModel as foreign key

UserModel.hasMany(CommentModel);
CommentModel.belongsTo(UserModel);

ArticleModel.hasMany(CommentModel);
CommentModel.belongsTo(ArticleModel);




