module.exports = (sequelize, Sequelize) => {
  const Pollution = sequelize.define("pollution", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    titre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lieu: {
      type: Sequelize.STRING
    },
    date_observation: {
      type: Sequelize.DATE
    },
    type_pollution: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    latitude: {
      type: Sequelize.DECIMAL(9,6)
    },
    longitude: {
      type: Sequelize.DECIMAL(9,6)
    },
    photo_data: {
      type: Sequelize.BLOB('long')
    },
    photo_mime: {
      type: Sequelize.STRING
    }
    ,
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }
  });

  return Pollution;
}; 
