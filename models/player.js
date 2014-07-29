/* Object/Relational mapping for instances of the Order class.
- classes correspond to tables
- instances correspond to rows
- fields correspond to columns
In other words, this code defines how a row in the postgres Player table
maps to the JS Order object.
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("Player", {
    id : {
      type : DataTypes.INTEGER,
      unique : true,
      allowNull : false,
      autoIncrement : true,
      primaryKey: true
    },
    number : {
      type : DataTypes.STRING,
    },
    chsName : {
      type : DataTypes.STRING,
      allowNull : false
    },
    firstName : {
      type : DataTypes.STRING,
      allowNull : false
    },
    lastName : {
      type : DataTypes.STRING,
      allowNull : false
    },
    email : {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false,
      validate : {
        isEmail : true,
      }
    },
    password : {
      type : DataTypes.STRING
    },
    mobile : {
      type : DataTypes.STRING
    },
    wechat : {
      type : DataTypes.STRING
    },
    favoritePosition : {
      type : DataTypes.STRING
    },
    latestEndurance : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 1,
        max : 5
      }
    },
    latestSpeed : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 1,
        max : 5
      }
    },
    latestDribble : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 1,
        max : 5
      }
    },
    latestPass : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 1,
        max : 5
      }
    },
    latestDefense : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 1,
        max : 5
      }
    },
    latestShoot : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 1,
        max : 5
      }
    },
    latestStrength : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 1,
        max : 5
      }
    },
    latestOverallAbility : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        min : 0,
        max : 100
      }
    }
  });
};
