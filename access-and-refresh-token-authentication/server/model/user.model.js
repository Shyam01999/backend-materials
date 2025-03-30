module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,

        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.JSONB,
            isValidImageObject(value) {
                // If it's an array, validate each object in the array
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (!item.public_id || !item.url) {
                            throw new AppError('Each avatar object must contain public_id and url');
                        }
                    });
                }
                // If it's a single object, validate that object
                else if (value && (!value.public_id || !value.url)) {
                    throw new AppError('Avatar object must contain public_id and url');
                }
            },
        }
    }, { freezeTableName: true });

    User.associate = (models) => {

        //A user can have multiple sessions
        User.hasMany(models.UserSession, {
            foreignKey: "userid",
            as: "session"
        })
    }

    return User;
}