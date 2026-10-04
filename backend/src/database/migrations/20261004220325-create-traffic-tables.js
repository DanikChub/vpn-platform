"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {

  async up(
      queryInterface,
      Sequelize,
  ) {

    await queryInterface.createTable(
        "vpn_node_traffic",
        {
          node_id: {
            type:
            Sequelize.INTEGER,

            allowNull:
                false,

            primaryKey:
                true,

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


          uplink_bytes: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
          },


          downlink_bytes: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
          },


          last_xray_uplink: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
          },


          last_xray_downlink: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
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


    await queryInterface.createTable(
        "vpn_user_node_traffic",
        {
          user_id: {
            type:
            Sequelize.INTEGER,

            allowNull:
                false,

            references: {
              model:
                  "users",

              key:
                  "id",
            },

            onUpdate:
                "CASCADE",

            onDelete:
                "CASCADE",
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


          uplink_bytes: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
          },


          downlink_bytes: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
          },


          last_xray_uplink: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
          },


          last_xray_downlink: {
            type:
            Sequelize.BIGINT,

            allowNull:
                false,

            defaultValue:
                0,
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


    await queryInterface.addConstraint(
        "vpn_user_node_traffic",
        {
          fields: [
            "user_id",
            "node_id",
          ],

          type:
              "primary key",

          name:
              "vpn_user_node_traffic_pkey",
        },
    );


    await queryInterface.addIndex(
        "vpn_user_node_traffic",
        [
          "node_id",
        ],
    );


    await queryInterface.addIndex(
        "vpn_user_node_traffic",
        [
          "user_id",
        ],
    );
  },


  async down(
      queryInterface,
  ) {

    await queryInterface.dropTable(
        "vpn_user_node_traffic",
    );


    await queryInterface.dropTable(
        "vpn_node_traffic",
    );
  },
};