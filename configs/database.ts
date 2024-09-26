import {Sequelize } from "sequelize"
const sequelize = new Sequelize(
    'product_sql',
    'root',
    '270901',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: (query, elapsedTime) => {
            console.log(`Query: ${query}`);
            // console.log(`Thời gian chạy: ${elapsedTime}ms`);
        },
        benchmark: true
    }
)
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
}).catch(err => {
    console.error('Unable to connect to the database:', err)
})
export default sequelize