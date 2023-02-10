import Sequelize from "sequelize";
import sequelize from "../utils/dbConfig";

const Product = sequelize.define('Product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        // defaultValue: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Product;