"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
        "marketing_sources",
        "trial_days",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        }
    );

    await queryInterface.sequelize.query(`
            UPDATE marketing_sources
            SET trial_days = 3
            WHERE code = 'organic'
        `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
        "marketing_sources",
        "trial_days"
    );
  },
};