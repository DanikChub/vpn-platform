"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {

  async up(
      queryInterface,
      Sequelize,
  ) {

    await queryInterface.createTable(
        "vpn_node_traffic_periods",
        {
          id: {
            type:
            Sequelize.INTEGER,

            allowNull:
                false,

            primaryKey:
                true,

            autoIncrement:
                true,
          },


          node_id: {
            type:
            Sequelize.INTEGER,

            allowNull:
                false,

            references: {
              model:
                  "vpn_nodes",

              key:
                  "id",
            },

            onUpdate:
                "CASCADE",

            onDelete:
                "CASCADE",
          },


          started_at: {
            type:
            Sequelize.DATE,

            allowNull:
                false,
          },


          ends_at: {
            type:
            Sequelize.DATE,

            allowNull:
                true,
          },


          limit_bytes: {
            type:
            Sequelize.BIGINT,

            allowNull:
                true,
          },


          used_bytes: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
          },


          created_at: {
            type:
            Sequelize.DATE,

            allowNull:
                false,

            defaultValue:
                Sequelize.literal(
                    "CURRENT_TIMESTAMP",
                ),
          },


          updated_at: {
            type:
            Sequelize.DATE,

            allowNull:
                false,

            defaultValue:
                Sequelize.literal(
                    "CURRENT_TIMESTAMP",
                ),
          },
        },
    );


    await queryInterface.addIndex(
        "vpn_node_traffic_periods",
        [
          "node_id",
          "started_at",
        ],
        {
          name:
              "vpn_node_traffic_periods_node_started_idx",
        },
    );
  },


  async down(
      queryInterface,
  ) {

    await queryInterface.dropTable(
        "vpn_node_traffic_periods",
    );
  },
};
