module.exports = (sequelize, DataTypes) => {
    const UserSession = sequelize.define('UserSession', {
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:"User",
                key:"id"
            }
        },
        valid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        user_agent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ip: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, { freezeTableName: true });

    UserSession.associate = (models) => {
        //Many to one: A UserSession belongs to one user
        UserSession.belongsTo(models.User, {
            foreignKey:"userid",
            as :"user"
        })
    }

    return UserSession;
}